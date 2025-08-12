"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, FileText } from "lucide-react";
import ClaimDetailModal from "./claim-detail-modal";
import ClaimSubmissionForm from "./claim-form"; // pastikan nama file ini sesuai

import type { Claim } from "@/lib/data";

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
    case "paid":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case "approved":
      return "Disetujui"
    case "rejected":
      return "Ditolak"
    case "pending":
      return "Review"
    case "paid":
      return "Dibayar"
    default:
      return status
  }
}

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID').format(parseInt(amount.replace(/\./g, '')))
}

export default function EmployeeClaimsList() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
  async function fetchClaims() {
    try {
      console.log("🚀 Mengambil data klaim dari API...");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`);
      
      console.log("📡 Status response:", res.status, res.statusText);
      const contentLength = res.headers.get("content-length");
      if (contentLength) {
        console.log("📏 Ukuran response (Content-Length):", contentLength, "bytes");
      }

      if (!res.ok) throw new Error("❌ Gagal fetch claims");

      const data = await res.json();
      console.log("✅ Data klaim diterima. Jumlah:", Array.isArray(data) ? data.length : "unknown");

      setClaims(data);
    } catch (error) {
      console.error("🔥 Terjadi error saat fetch claims:", error);
    }
  }

  fetchClaims();
}, []);


  const handleViewDetail = (claim: Claim) => {
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
        <Button onClick={handleNewClaim} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
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
                    {claim.desc1 || claim.description || "Kategori Klaim"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
                    {claim.desc2 || claim.description || "-"}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(claim.transaction_date).toLocaleDateString('id-ID')}
                    </span>
                    <span>
                      ID: {claim.id.slice(0, 8)} {/* potong ID agar tidak terlalu panjang */}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Rp {formatCurrency(claim.transaction_total)}
                  </div>
                  <Badge className={getStatusColor(claim.status_id)}>
                    {getStatusText(claim.status_id)}
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
      {showDetailModal && selectedClaim && <ClaimDetailModal claim={selectedClaim} onClose={handleCloseDetailModal} />}
      {showSubmissionForm && <ClaimSubmissionForm onClose={handleCloseSubmissionForm} />}
    </div>
  );
}
