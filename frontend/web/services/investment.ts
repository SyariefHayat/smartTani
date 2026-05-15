import api from '@/lib/api';

export interface ProposalLocation {
  province: string;
  city: string;
  district: string;
  full_address: string;
}

export interface Proposal {
  id: string;
  farmer_id: string;
  title: string;
  commodity: string;
  land_area_ha: number;
  location: ProposalLocation;
  funding_needed: number;
  funding_raised: number;
  projected_roi_percent: number;
  duration_days: number;
  harvest_date_estimated: string;
  description: string;
  use_of_funds: string;
  risk_notes: string;
  supporting_docs: string[];
  status: 'pending' | 'submitted' | 'approved' | 'rejected' | 'open_for_funding' | 'funded' | 'completed' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  investor_id: string;
  proposal_id: string;
  amount: number;
  platform_fee_percent: number;
  projected_return: number;
  actual_return: number | null;
  status: 'paid' | 'completed';
  invested_at: string;
  completed_at: string | null;
  proposal: Partial<Proposal>;
}

export interface GetPortfolioResponse {
  success: boolean;
  data: Investment[];
  message?: {
    total_invested: number;
    total_projected_return: number;
    total_actual_return: number;
    total_investments: number;
  };
}

export interface GetProposalsParams {
  status?: string;
  category?: string;
  location_province?: string;
  page?: number;
  limit?: number;
}

export interface GetProposalsResponse {
  success: boolean;
  data: {
    proposals: Proposal[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface GetProposalResponse {
  success: boolean;
  data: Proposal;
}

export interface CreateProposalInput {
  title: string;
  commodity: string;
  land_area_ha: number;
  location: ProposalLocation;
  funding_needed: number;
  projected_roi_percent: number;
  duration_days: number;
  harvest_date_estimated: string;
  description: string;
  use_of_funds: string;
  risk_notes: string;
}

export const investmentService = {
  getProposals: async (params: GetProposalsParams): Promise<GetProposalsResponse> => {
    const response = await api.get('/proposals', { params });
    return response.data;
  },

  getProposalById: async (id: string): Promise<GetProposalResponse> => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  getPortfolio: async (): Promise<GetPortfolioResponse> => {
    const response = await api.get('/investments');
    return response.data;
  },

  createInvestment: async (data: { proposalId: string; amount: number }) => {
    const response = await api.post('/investments', data);
    return response.data;
  },

  createProposal: async (data: CreateProposalInput): Promise<GetProposalResponse> => {
    const response = await api.post('/proposals', data);
    return response.data;
  },

  updateProposal: async (id: string, data: Partial<CreateProposalInput>): Promise<GetProposalResponse> => {
    const response = await api.patch(`/proposals/${id}`, data);
    return response.data;
  },

  submitProposal: async (id: string): Promise<GetProposalResponse> => {
    const response = await api.post(`/proposals/${id}/submit`);
    return response.data;
  },

  approveProposal: async (id: string): Promise<GetProposalResponse> => {
    const response = await api.post(`/proposals/${id}/approve`);
    return response.data;
  },

  rejectProposal: async (id: string, reason: string): Promise<GetProposalResponse> => {
    const response = await api.post(`/proposals/${id}/reject`, { reason });
    return response.data;
  },
};
