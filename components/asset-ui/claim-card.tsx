"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Hash, Eye, CreditCard } from "lucide-react";
import Image from "next/image";

interface Claim {
  id: string;
  user_id?: string;
  claim_type_id?: string;
  desc1?: string;
  desc2?: string;
  transaction_date?: string;
  transaction_total?: string;
  status_id?: string;
  description?: string;
  claim_attachments?: string[];
  user_name?: string; 
  category?: string;
  reviewed_by?: string;
  status_text?: string;
}

interface Payment {
  id: string;
  note: string;
  proof: string;
  bank: string;
  created_at: string;
  claim: {
    id: string;
    employee_name: string;
    amount: string;
    description: string;
    category: string;
    status: string;
    submission_date: string;
    approval_date: string;
    review_date: string;
    nik: string;
    notes?: string;
    reviewed_by?: string;
  };
}

interface PaymentCardProps {
  claim?: Claim;
  payment?: Payment;
  onAction?: (payment: Payment) => void;
  actionLabel?: string;
  actionIcon?: React.ElementType;
  showActions?: boolean;
}

// Type guard untuk membedakan objek claim vs payment.claim
function isPaymentClaim(data: any): data is Payment["claim"] {
  return data && typeof data.employee_name === "string";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
    case "pending":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
    case "paid":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Medis":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
    case "Pembelian Barang":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800";
    case "Perjalanan Dinas":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "pending":
      return "Pending";
    case "paid":
      return "Dibayar";
    default:
      return status;
  }
};

const formatCurrency = (amount: string) => {
  if (!amount) return "-";
  return new Intl.NumberFormat("id-ID").format(parseInt(amount.replace(/\./g, "")));
};

export default function ClaimCard({
  claim,
  payment,
  onAction,
  actionLabel = "Process",
  actionIcon: ActionIcon = CreditCard,
  showActions = true,
}: PaymentCardProps) {
  const isPayment = Boolean(payment);
  const data = isPayment ? payment!.claim : claim;

  if (!data) return null;

  const isPaymentClaimData = isPaymentClaim(data);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const initials = isPaymentClaimData
    ? getInitials(data.employee_name)
    : getInitials(data.user_name || "U");
    
  const displayName = isPaymentClaimData ? data.employee_name : data.user_name || "Tanpa Nama";

  const status = isPaymentClaimData ? data.status : data.status_id || "";

  const category = isPaymentClaimData ? data.category : data.category || "-";

  const amount = isPaymentClaimData ? data.amount : data.transaction_total || "";

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg">
      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{displayName}</h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className={getCategoryColor(category)}>
                  {category}
                </Badge>
                <Badge variant="outline" className={getStatusColor(status)}>
                  {getStatusText(status)}
                </Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {data.id}
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">Rp {formatCurrency(amount)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {"reviewed_by" in data && data.reviewed_by ? `Oleh ${data.reviewed_by}` : ""}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {"description" in data ? data.description : claim?.desc2 || "-"}
        </p>

        {/* Notes (only for payment.claim) */}
        {isPaymentClaimData && data.notes && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Catatan:</strong> {data.notes}
            </p>
          </div>
        )}

        {/* Proof image (only for payment) */}
        {isPayment && payment!.proof && (
          <div className="mb-4">
            <Image
              src={payment!.proof}
              alt="Bukti pembayaran"
              width={400}
              height={200}
              className="rounded-md border"
            />
          </div>
        )}

        {/* Details Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{isPaymentClaimData ? data.nik : claim?.user_id || "-"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {isPaymentClaimData
                  ? data.approval_date || data.review_date || data.submission_date
                  : claim?.transaction_date || "-"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && isPayment && onAction && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Detail
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                onClick={() => onAction(payment!)}
              >
                <ActionIcon className="w-4 h-4 mr-2" />
                {actionLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
