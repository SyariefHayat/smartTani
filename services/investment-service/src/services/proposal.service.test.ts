import proposalService from './proposal.service';
import proposalRepository from '../repositories/proposal.repository';
import { CreateProposalInput } from '../schemas/proposal.schema';
import MessageBroker from '../lib/broker';

jest.mock('../repositories/proposal.repository');
jest.mock('../lib/broker', () => ({
  publish: jest.fn(),
  connect: jest.fn(),
}));

describe('ProposalService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a proposal successfully', async () => {
    const farmerId = 'farmer-123';
    const mockInput: CreateProposalInput = {
      title: 'Kebun Jagung Modern',
      commodity: 'Jagung',
      land_area_ha: 2.5,
      location: {
        province: 'Jawa Barat',
        city: 'Bandung',
        district: 'Lembang',
        full_address: 'Jl. Pertanian No. 1',
      },
      funding_needed: 50000000,
      projected_roi_percent: 15.5,
      duration_days: 120,
      harvest_date_estimated: '2026-10-15T00:00:00.000Z',
      description: 'Proyek ini bertujuan untuk membangun...',
      use_of_funds: 'Dana akan digunakan untuk bibit dan pupuk...',
      risk_notes: 'Risiko utama adalah cuaca buruk...',
    };

    const mockCreatedProposal = {
      id: 'proposal-123',
      farmer_id: farmerId,
      ...mockInput,
      status: 'draft',
      created_at: new Date(),
      updated_at: new Date(),
    };

    (proposalRepository.create as jest.Mock).mockResolvedValue(mockCreatedProposal);

    const result = await proposalService.createProposal(farmerId, mockInput);

    expect(proposalRepository.create).toHaveBeenCalledWith(farmerId, mockInput);
    expect(result).toEqual(mockCreatedProposal);
  });

  describe('getProposals', () => {
    it('should call findAll with correct arguments', async () => {
      const mockUser = { id: 'user-1', role: 'admin' };
      const mockQuery = { status: 'draft', category: 'Jagung', page: 2, limit: 10 };
      
      const mockResult = { data: [], meta: { total: 0, page: 2, limit: 10, total_pages: 0 } };
      (proposalRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await proposalService.getProposals(mockQuery, mockUser);

      expect(proposalRepository.findAll).toHaveBeenCalledWith(
        { status: 'draft', category: 'Jagung' },
        { page: 2, limit: 10 },
        mockUser
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getProposalById', () => {
    it('should return proposal if found', async () => {
      const mockUser = { id: 'user-1', role: 'investor' };
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProposal = { id: mockId, status: 'open_for_funding' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);

      const result = await proposalService.getProposalById(mockId, mockUser);
      expect(proposalRepository.findById).toHaveBeenCalledWith(mockId, mockUser);
      expect(result).toEqual(mockProposal);
    });

    it('should throw 404 if not found or no access', async () => {
      const mockUser = { id: 'user-1', role: 'investor' };
      const mockId = '123e4567-e89b-12d3-a456-426614174000';

      (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(proposalService.getProposalById(mockId, mockUser)).rejects.toThrow('Proposal tidak ditemukan atau Anda tidak memiliki akses');
    });
  });

  describe('updateProposal', () => {
    it('should update proposal if status is draft', async () => {
      const mockUserId = 'user-1';
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockData = { title: 'New Title' };
      const mockProposal = { id: mockId, farmer_id: mockUserId, status: 'draft' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);
      (proposalRepository.update as jest.Mock).mockResolvedValue({ ...mockProposal, ...mockData });

      const result = await proposalService.updateProposal(mockId, mockUserId, mockData);

      expect(proposalRepository.findById).toHaveBeenCalledWith(mockId, { id: mockUserId, role: 'petani' });
      expect(proposalRepository.update).toHaveBeenCalledWith(mockId, mockData);
      expect(result.title).toBe('New Title');
    });

    it('should throw 400 if proposal is not draft', async () => {
      const mockUserId = 'user-1';
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockData = { title: 'New Title' };
      const mockProposal = { id: mockId, farmer_id: mockUserId, status: 'submitted' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);

      await expect(proposalService.updateProposal(mockId, mockUserId, mockData)).rejects.toThrow('Hanya proposal dengan status draft yang dapat diedit');
      expect(proposalRepository.update).not.toHaveBeenCalled();
    });

    it('should throw 404 if proposal not found or no access', async () => {
      const mockUserId = 'user-1';
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockData = { title: 'New Title' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(proposalService.updateProposal(mockId, mockUserId, mockData)).rejects.toThrow('Proposal tidak ditemukan atau Anda tidak memiliki akses');
      expect(proposalRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('submitProposal', () => {
    it('should submit proposal and publish event if draft', async () => {
      const mockUserId = 'user-1';
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProposal = { id: mockId, farmer_id: mockUserId, status: 'draft' };
      const mockUpdated = { ...mockProposal, status: 'submitted' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);
      (proposalRepository.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await proposalService.submitProposal(mockId, mockUserId);

      expect(proposalRepository.update).toHaveBeenCalledWith(mockId, { status: 'submitted' });
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'proposal.submitted',
        expect.objectContaining({ id: mockId, status: 'submitted' })
      );
      expect(result).toEqual(mockUpdated);
    });

    it('should throw 400 if proposal is not draft', async () => {
      const mockUserId = 'user-1';
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProposal = { id: mockId, farmer_id: mockUserId, status: 'open_for_funding' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);

      await expect(proposalService.submitProposal(mockId, mockUserId)).rejects.toThrow('Hanya proposal dengan status draft yang dapat disubmit');
      expect(proposalRepository.update).not.toHaveBeenCalled();
      expect(MessageBroker.publish).not.toHaveBeenCalled();
    });

    it('should throw 404 if proposal not found', async () => {
      const mockUserId = 'user-1';
      const mockId = '123e4567-e89b-12d3-a456-426614174000';

      (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(proposalService.submitProposal(mockId, mockUserId)).rejects.toThrow('Proposal tidak ditemukan atau Anda tidak memiliki akses');
      expect(proposalRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('approveProposal', () => {
    it('should approve proposal and publish event if submitted', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProposal = { id: mockId, farmer_id: 'petani-1', status: 'submitted' };
      const mockUpdated = { ...mockProposal, status: 'open_for_funding', approved_at: new Date() };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);
      (proposalRepository.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await proposalService.approveProposal(mockId);

      expect(proposalRepository.findById).toHaveBeenCalledWith(mockId, { id: 'system', role: 'admin' });
      expect(proposalRepository.update).toHaveBeenCalledWith(mockId, expect.objectContaining({ status: 'open_for_funding' }));
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'proposal.approved',
        expect.objectContaining({ id: mockId, status: 'open_for_funding' })
      );
      expect(result).toEqual(mockUpdated);
    });

    it('should throw 400 if proposal is not submitted', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProposal = { id: mockId, farmer_id: 'petani-1', status: 'draft' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);

      await expect(proposalService.approveProposal(mockId)).rejects.toThrow('Hanya proposal dengan status submitted yang dapat disetujui');
      expect(proposalRepository.update).not.toHaveBeenCalled();
      expect(MessageBroker.publish).not.toHaveBeenCalled();
    });

    it('should throw 404 if proposal not found', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';

      (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(proposalService.approveProposal(mockId)).rejects.toThrow('Proposal tidak ditemukan');
      expect(proposalRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('rejectProposal', () => {
    it('should reject proposal with reason and publish event', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockReason = 'Lahan terlalu kecil untuk proposal ini';
      const mockProposal = { id: mockId, farmer_id: 'petani-1', status: 'submitted' };
      const mockUpdated = { ...mockProposal, status: 'rejected', admin_notes: mockReason };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);
      (proposalRepository.update as jest.Mock).mockResolvedValue(mockUpdated);

      const result = await proposalService.rejectProposal(mockId, mockReason);

      expect(proposalRepository.update).toHaveBeenCalledWith(mockId, expect.objectContaining({ status: 'rejected', admin_notes: mockReason }));
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'proposal.rejected',
        expect.objectContaining({ id: mockId, status: 'rejected', reason: mockReason })
      );
      expect(result).toEqual(mockUpdated);
    });

    it('should throw 400 if proposal is not submitted', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';
      const mockProposal = { id: mockId, farmer_id: 'petani-1', status: 'draft' };

      (proposalRepository.findById as jest.Mock).mockResolvedValue(mockProposal);

      await expect(proposalService.rejectProposal(mockId, 'Alasan penolakan yang valid')).rejects.toThrow('Hanya proposal dengan status submitted yang dapat ditolak');
      expect(proposalRepository.update).not.toHaveBeenCalled();
      expect(MessageBroker.publish).not.toHaveBeenCalled();
    });

    it('should throw 404 if proposal not found', async () => {
      const mockId = '123e4567-e89b-12d3-a456-426614174000';

      (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(proposalService.rejectProposal(mockId, 'Alasan penolakan yang valid')).rejects.toThrow('Proposal tidak ditemukan');
      expect(proposalRepository.update).not.toHaveBeenCalled();
    });
  });
});
