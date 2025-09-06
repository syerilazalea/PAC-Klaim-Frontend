"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText } from "lucide-react";
import ClaimDetailModal from "./claim-detail-modal";
import ClaimSubmissionForm from "./claim-form";
import type { Claim } from "@/lib/data";

const getStatusColor = (status: string | undefined | null) => {
  const normalizedStatus = !status ? "pending" : status.toLowerCase();

  switch (normalizedStatus) {
    case "diterima":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
    case "ditolak":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
    default:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  }
};

const getStatusText = (status: string | undefined | null) => {
  const normalizedStatus = !status ? "pending" : status.toLowerCase();

  switch (normalizedStatus) {
    case "diterima":
      return "Disetujui";
    case "ditolak":
      return "Ditolak";
    default: 
      return "Menunggu review";
  }
};

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("id-ID").format(parseInt(amount.replace(/\./g, "")));
};

export default function EmployeeClaimsList() {
  const [claims, setClaims] = useState<(Claim & {
    userName: string;
    claimTypeName: string;
    statusName: string;
  })[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<(Claim & {
    userName: string;
    claimTypeName: string;
    statusName: string;
  }) | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const fetchClaims = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`);
      if (!res.ok) throw new Error("Gagal fetch claims");
      const data = await res.json();

      const mappedData = data.map((item: any) => ({...item,
        userName: item.user?.name ?? "Nama tidak diketahui",
        claimTypeName: item.claim_type?.name ?? "Jenis klaim tidak diketahui",
        statusName: item.status?.name ?? "pending", 
      }));

      setClaims(mappedData);
    } catch (error) {
      console.error("Error fetch claims:", error);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handleViewDetail = (claim: typeof claims[number]) => {
    setSelectedClaim(claim);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedClaim(null);
  };

  const handleNewClaim = () => {
    setShowSubmissionForm(true);
  };

  const handleCloseSubmissionForm = () => {
    setShowSubmissionForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daftar Klaim Saya</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{claims.length} klaim yang telah diajukan</p>
        </div>
        <Button
          onClick={handleNewClaim}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Buat Klaim Baru
        </Button>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.length > 0 ? (
          claims.map((claim) => (
            <div
              key={claim.id}
              onClick={() => handleViewDetail(claim)}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg cursor-pointer p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {claim.claimTypeName || claim.desc1 || claim.description || "Kategori Klaim"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                    {claim.desc2 || claim.description || "-"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(claim.transaction_date || "").toLocaleDateString("id-ID")}</span>
                    <span>ID: {claim.id.slice(0, 8)}</span>
                    <span>User: {claim.userName}</span>
                    <span>Status: {claim.statusName}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Rp {formatCurrency(claim.transaction_total || "0")}
                  </div>
                  <Badge className={getStatusColor(claim.statusName ?? "")}>
                    {claim.statusName ?? "Status Tidak Diketahui"}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada klaim</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Anda belum mengajukan klaim apapun</p>
            <Button onClick={handleNewClaim} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Buat Klaim Pertama
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedClaim && (
        <ClaimDetailModal claim={selectedClaim} onClose={handleCloseDetailModal} />
      )}

      {showSubmissionForm && (
        <ClaimSubmissionForm
          onClose={handleCloseSubmissionForm}
          onSuccess={() => {
            handleCloseSubmissionForm();
            fetchClaims(); 
          }}
        />
      )}
    </div>
  );
}
