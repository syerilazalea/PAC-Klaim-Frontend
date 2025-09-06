// lib/data/claims.ts
export interface Claim {
  id: string;
  user_id: string;
  claim_type_id: string;
  desc1: string;
  desc2: string | null;
  transaction_date: string;
  transaction_total: string;
  status_id: string | null;
  description?: string | null;
  created_at: string;
  updated_at: string;
  attachments?: {
    id: string;
    file_path: string;
    file_name: string;
    file_type: string;
    uploadedAt: string;
  }[];
  reviews?: {
    id: string;
    user_id: string;
    claim_id: string;
    status_id: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }[];

  // Optional fields for UI compatibility
  reviewId?: string;
  userId?: string;
  amount?: number;
  employeeName?: string;
  category?: string;
}

export type Payment = {
  id: string;
  note: string;
  bank: string;
  claim: Claim;
  review?: {
    id: string;
    user_id: string;
    claim_id: string;
    status_id: string;
    description?: string;
    created_at: string;
    updated_at: string;
  };
  payment_method?: {
    id: string;
    method: string;
    created_at: string;
    updated_at: string;
  };
  proofs: { file_url: string }[];
};