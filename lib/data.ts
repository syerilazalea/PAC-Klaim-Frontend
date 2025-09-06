export interface Claim {
  id: string;
  user_id: string;
  claim_type_id: string;
  desc1: string;
  desc2: string;
  transaction_date: string;
  transaction_total: string; // amount
  status_id: string;
  description?: string;
  created_at: string;
  updated_at: string;

  // Tambahan agar tidak error di komponen
  claimId?: string;
  amount?: number;
  status?: string;
  category?: string;
  nik?: string;
  submissionDate?: string;
  reviewDate?: string;
  approvalDate?: string;
  notes?: string;
  reviewedBy?: string;

  // Properti baru untuk nama user, status, dan jenis klaim
  userName?: string;
  statusName?: string;
  claimTypeName?: string;
}

export interface Review {
  id: string;
  user_id: string;
  claim_id: string;
  status_id: string;
  description?: string;
  created_at: string;
  updated_at: string;

  // relasi ke Claim
  claim: Claim;
}

export type Payment = {
  id: string;
  note: string;
  bank: string;
  claim: Claim;
  review?: Review;
  payment_method?: {
    id: string;
    method: string;
    created_at: string;
    updated_at: string;
  };
  proofs: { file_url: string }[];
};

export const SAMPLE_CLAIMS: Claim[] = [
  {
    id: "1",
    user_id: "user-001",
    claim_type_id: "type-001",
    desc1: "Klaim transportasi",
    desc2: "Biaya transport",
    transaction_date: "2025-01-20",
    transaction_total: "420000",
    status_id: "approved",
    description: "Pemeriksaan kesehatan berkala dan pembelian vitamin",
    created_at: "2025-01-20T10:00:00Z",
    updated_at: "2025-01-21T10:00:00Z",
  },
  {
    id: "2",
    user_id: "user-002",
    claim_type_id: "type-002",
    desc1: "Klaim kesehatan",
    desc2: "Rawat jalan",
    transaction_date: "2025-02-10",
    transaction_total: "310000",
    status_id: "approved",
    description: "Pengobatan flu dan pembelian obat",
    created_at: "2025-02-10T08:00:00Z",
    updated_at: "2025-02-11T10:00:00Z",
  },
];

export const getClaimsByStatus = (status: string) => {
  return SAMPLE_CLAIMS.filter((claim) => claim.status_id === status);
};

export const getClaimsForFinance = () => {
  return SAMPLE_CLAIMS.filter((claim) => claim.status_id === "approved");
};

export const getClaimsForHR = () => {
  return SAMPLE_CLAIMS.filter(
    (claim) => claim.status_id === "pending" && !claim.transaction_date
  );
};

export const getClaimsForEmployee = (employeeId?: string) => {
  if (employeeId) {
    return SAMPLE_CLAIMS.filter((claim) => claim.user_id === employeeId);
  }
  return SAMPLE_CLAIMS;
};
