import { logger } from '../../../../shared/utils/logger';
import { CreateProposalInput } from '../schemas/proposal.schema';
import proposalRepository from '../repositories/proposal.repository';
import MessageBroker from '../lib/broker';

class ProposalService {
  async createProposal(farmerId: string, data: CreateProposalInput) {
    return await proposalRepository.create(farmerId, data);
  }

  async getProposals(
    query: {
      status?: string;
      category?: string;
      location_province?: string;
      page?: number;
      limit?: number;
    },
    user: { id: string; role: string }
  ) {
    const { page = 1, limit = 20, ...filters } = query;
    return await proposalRepository.findAll(filters, { page, limit }, user);
  }

  async getProposalById(id: string, user: { id: string; role: string }) {
    const proposal = await proposalRepository.findById(id, user);
    if (!proposal) {
      const error: any = new Error('Proposal tidak ditemukan atau Anda tidak memiliki akses');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }
    return proposal;
  }

  async updateProposal(id: string, userId: string, data: Partial<CreateProposalInput>) {
    // Cannot use findById because it has RBAC for reading. We just want raw DB object.
    const proposal = await proposalRepository.findById(id, { id: userId, role: 'petani' });
    
    if (!proposal) {
      const error: any = new Error('Proposal tidak ditemukan atau Anda tidak memiliki akses');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (proposal.status !== 'draft') {
      const error: any = new Error('Hanya proposal dengan status draft yang dapat diedit');
      error.statusCode = 400;
      error.code = 'PROPOSAL_001';
      throw error;
    }

    return await proposalRepository.update(id, data);
  }

  async submitProposal(id: string, userId: string) {
    const proposal = await proposalRepository.findById(id, { id: userId, role: 'petani' });
    
    if (!proposal) {
      const error: any = new Error('Proposal tidak ditemukan atau Anda tidak memiliki akses');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (proposal.status !== 'draft') {
      const error: any = new Error('Hanya proposal dengan status draft yang dapat disubmit');
      error.statusCode = 400;
      error.code = 'PROPOSAL_002';
      throw error;
    }

    const updatedProposal = await proposalRepository.update(id, { status: 'submitted' } as any);

    try {
      await MessageBroker.publish('smarttani.events', 'proposal.submitted', {
        id: updatedProposal.id,
        farmer_id: updatedProposal.farmer_id,
        title: updatedProposal.title,
        commodity: updatedProposal.commodity,
        funding_needed: Number(updatedProposal.funding_needed),
        status: updatedProposal.status,
        submitted_at: new Date(),
      });
    } catch (error) {
      logger.error('Failed to publish proposal.submitted event', error);
      // We don't fail the request if event publishing fails, but log it
    }

    return updatedProposal;
  }

  async approveProposal(id: string) {
    // Role is admin so it bypasses ownership checks
    const proposal = await proposalRepository.findById(id, { id: 'system', role: 'admin' });
    
    if (!proposal) {
      const error: any = new Error('Proposal tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (proposal.status !== 'submitted') {
      const error: any = new Error('Hanya proposal dengan status submitted yang dapat disetujui');
      error.statusCode = 400;
      error.code = 'PROPOSAL_003';
      throw error;
    }

    const updatedProposal = await proposalRepository.update(id, {
      status: 'open_for_funding',
      approved_at: new Date(),
    } as any);

    try {
      await MessageBroker.publish('smarttani.events', 'proposal.approved', {
        id: updatedProposal.id,
        farmer_id: updatedProposal.farmer_id,
        title: updatedProposal.title,
        status: updatedProposal.status,
        approved_at: updatedProposal.approved_at,
      });
    } catch (error) {
      logger.error('Failed to publish proposal.approved event', error);
    }

    return updatedProposal;
  }

  async rejectProposal(id: string, reason: string) {
    const proposal = await proposalRepository.findById(id, { id: 'system', role: 'admin' });

    if (!proposal) {
      const error: any = new Error('Proposal tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (proposal.status !== 'submitted') {
      const error: any = new Error('Hanya proposal dengan status submitted yang dapat ditolak');
      error.statusCode = 400;
      error.code = 'PROPOSAL_004';
      throw error;
    }

    const updatedProposal = await proposalRepository.update(id, {
      status: 'rejected',
      admin_notes: reason,
    } as any);

    try {
      await MessageBroker.publish('smarttani.events', 'proposal.rejected', {
        id: updatedProposal.id,
        farmer_id: updatedProposal.farmer_id,
        title: updatedProposal.title,
        status: updatedProposal.status,
        reason,
        rejected_at: new Date(),
      });
    } catch (error) {
      logger.error('Failed to publish proposal.rejected event', error);
    }

    return updatedProposal;
  }
}

export default new ProposalService();
