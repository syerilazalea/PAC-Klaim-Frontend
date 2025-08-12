"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Calendar, User, FileText, Paperclip } from "lucide-react";
import type { Claim } from "@/lib/data";

interface Attachment {
  file_name: string;
  uploadedAt: string;
}

interface ClaimDetailModalProps {
  claim: Claim & {
    attachments?: Attachment[];
    userName: string;
    claimTypeName: string;
    statusName: string;
  };
  onClose: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    case "paid":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "pending":
      return "Menunggu Review";
    case "paid":
      return "Sudah Dibayar";
    default:
      return "Status Tidak Diketahui";
  }
};

const formatCurrency = (amount?: string | number): string => {
  if (amount === undefined || amount === null) return "Rp 0";

  let numericValue: number;

  if (typeof amount === "string") {
    const cleaned = amount.replace(/[^\d.-]/g, "");
    numericValue = parseFloat(cleaned);
  } else {
    numericValue = amount;
  }

  if (isNaN(numericValue)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID");
};

export default function ClaimDetailModal({ claim, onClose }: ClaimDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Klaim</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{claim.id ?? "-"}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8 space-y-8">
          {/* Status & Amount */}
          <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(claim.statusName)} text-sm px-4 py-2`}>
              {getStatusText(claim.statusName)}
            </Badge>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(claim.transaction_total)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Klaim</div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Jenis Klaim */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Jenis Klaim</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {claim.claimTypeName ?? "-"}
                  </div>
                </div>
              </div>

              {/* Nama User */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950/30 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Nama Pengguna</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {claim.userName ?? "-"}
                  </div>
                </div>
              </div>
            </div>

            {/* Tanggal Transaksi */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Tanggal Transaksi</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {claim.transaction_date ? new Date(claim.transaction_date).toLocaleDateString("id-ID") : "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Deskripsi Klaim */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Deskripsi Klaim</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{claim.description || "-"}</p>
            </div>
          </div>

          {/* Lampiran */}
          {claim.attachments && claim.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lampiran</h3>
              <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-3">
                {claim.attachments.map((att, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                      <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/uploads/${att.file_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      >
                        {att.file_name}
                      </a>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Uploaded on {formatDate(att.uploadedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button
              onClick={onClose}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
