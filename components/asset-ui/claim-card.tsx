// components/asset-ui/claim-card.tsx
"use client";

import { Claim } from "@/lib/data";

export interface ClaimCardProps {
  claim: Claim;
  onAction?: (data: Claim) => void;
  actionLabel?: string;
  showActions?: boolean;
}

export default function ClaimCard({
  claim,
  onAction,
  actionLabel = "Action",
  showActions = false,
}: ClaimCardProps) {
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <h3 className="font-semibold text-lg">{claim.desc1}</h3>
      {claim.desc2 && <p className="text-sm text-gray-600">{claim.desc2}</p>}
      <p className="text-sm mt-2">
        Total: {claim.transaction_total} | Date: {claim.transaction_date}
      </p>
      {claim.statusName && (
        <p className="text-sm mt-1">Status: {claim.statusName}</p>
      )}
      {showActions && onAction && (
        <button
          className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onAction(claim)}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
