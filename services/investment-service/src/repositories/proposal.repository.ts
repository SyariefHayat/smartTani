import prisma from '../lib/prisma';
import { CreateProposalInput } from '../schemas/proposal.schema';

class ProposalRepository {
  async create(farmerId: string, data: CreateProposalInput) {
    return await prisma.proposal.create({
      data: {
        farmer_id: farmerId,
        title: data.title,
        commodity: data.commodity,
        land_area_ha: data.land_area_ha,
        location: data.location,
        funding_needed: data.funding_needed,
        projected_roi_percent: data.projected_roi_percent,
        duration_days: data.duration_days,
        harvest_date_estimated: data.harvest_date_estimated,
        description: data.description,
        use_of_funds: data.use_of_funds,
        risk_notes: data.risk_notes,
        status: 'draft',
      },
    });
  }

  async findAll(
    filters: {
      status?: string;
      category?: string;
      location_province?: string;
    },
    pagination: { page: number; limit: number },
    user: { id: string; role: string }
  ) {
    const skip = (pagination.page - 1) * pagination.limit;
    const take = pagination.limit;

    const where: any = {};

    // Apply role-based visibility rules
    if (user.role === 'investor') {
      where.status = 'open_for_funding';
    } else if (user.role === 'petani') {
      where.farmer_id = user.id;
    }
    // admin sees all by default

    // Apply filters
    if (filters.status && user.role !== 'investor') {
      // Investor can only see open_for_funding regardless of filter
      where.status = filters.status;
    }
    if (filters.category) {
      where.commodity = filters.category;
    }
    if (filters.location_province) {
      where.location = {
        path: ['province'],
        equals: filters.location_province,
      };
    }

    const [data, total] = await Promise.all([
      prisma.proposal.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      prisma.proposal.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        total_pages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async findById(id: string, user: { id: string; role: string }) {
    const proposal = await prisma.proposal.findUnique({
      where: { id },
    });

    if (!proposal) return null;

    // RBAC logic
    if (user.role === 'investor' && proposal.status !== 'open_for_funding') {
      return null;
    }
    if (user.role === 'petani' && proposal.farmer_id !== user.id) {
      return null;
    }

    // Calculate real funding_raised from active investments
    const activeInvestments = await prisma.investment.aggregate({
      _sum: { amount: true },
      where: {
        proposal_id: id,
        status: 'paid', // Active investments
      },
    });

    const funding_raised = Number(activeInvestments._sum.amount || 0);
    const funding_needed = Number(proposal.funding_needed);
    const funding_percentage = funding_needed > 0 ? (funding_raised / funding_needed) * 100 : 0;

    return {
      ...proposal,
      funding_raised, // Override with accurate sum
      funding_percentage: Math.min(funding_percentage, 100), // Cap at 100% just in case
    };
  }

  async update(id: string, data: Partial<CreateProposalInput>) {
    return await prisma.proposal.update({
      where: { id },
      data,
    });
  }
}

export default new ProposalRepository();
