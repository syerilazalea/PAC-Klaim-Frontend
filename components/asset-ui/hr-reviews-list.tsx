"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, CheckSquare } from "lucide-react";
import type { Claim } from "@/lib/data";
import ReviewModal, { Review, Status } from "./review-modal";

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

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat("id-ID").format(parseInt(amount.replace(/\./g, "")));
};

export default function HRReviewList() {
  const [pendingReviews, setPendingReviews] = useState<(Claim & { userName: string; claimTypeName: string; statusName: string })[]>([]);
  const [completedReviews, setCompletedReviews] = useState<(Claim & { userName: string; claimTypeName: string; statusName: string })[]>([]);
  const [selectedReview, setSelectedReview] = useState<(Claim & { userName: string; claimTypeName: string; statusName: string }) | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Ambil status dari backend / contoh UUID status
  const statusList: Status[] = [
    { id: "759c3828-4007-4b37-a023-1cfa1a84991a", name: "Diterima" },
    { id: "2b8e7c21-1c2a-4e8f-8c3b-123456789abc", name: "Ditolak" },
  ];

  const currentUserId = "3f627c0b-bea2-4708-9319-37903adf67ea"; // user HR login

  const fetchPendingReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`);
      if (!res.ok) throw new Error("Gagal fetch pending reviews");
      const data = await res.json();

      const mappedData = data.map((item: any) => ({
        ...item,
        userName: item.user?.name ?? "Nama tidak diketahui",
        claimTypeName: item.claim_type?.name ?? "Jenis klaim tidak diketahui",
        statusName: item.status?.name ?? "pending",
      }));

      setPendingReviews(mappedData);
    } catch (error) {
      console.error("Error fetch pending reviews:", error);
    }
  };

  const fetchCompletedReviews = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`);
      if (!res.ok) throw new Error("Gagal fetch completed reviews");
      const data = await res.json();

      const mappedData = data.map((item: any) => ({
        ...item,
        userName: item.user?.name ?? "Nama tidak diketahui",
        claimTypeName: item.claim_type?.name ?? "Jenis klaim tidak diketahui",
        statusName: item.status?.name ?? "pending",
      }));

      setCompletedReviews(mappedData);
    } catch (error) {
      console.error("Error fetch completed reviews:", error);
    }
  };

  useEffect(() => {
    fetchPendingReviews();
    fetchCompletedReviews();
  }, []);

  const handleReviewAction = (review: typeof pendingReviews[number]) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (reviewData: Review) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claim_id: reviewData.claim_id,
          user_id: reviewData.user_id,
          status_id: reviewData.status_id,
          description: reviewData.description,
        }),
      });

      const result = await res.json();
      console.log("Submit response:", res.status, result);

      if (!res.ok) throw new Error(result.message || "Gagal submit review");

      setShowReviewModal(false);
      fetchPendingReviews();
      fetchCompletedReviews();
    } catch (error) {
      console.error("Error submit review:", error);
    }
  };

  const renderCard = (review: typeof pendingReviews[number], showReviewButton = false) => (
    <div
      key={review.id}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            {review.claimTypeName || review.desc1 || review.description || "Kategori Klaim"}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">
            {review.desc2 || review.description || "-"}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{new Date(review.transaction_date || "").toLocaleDateString("id-ID")}</span>
            <span>ID: {review.id.slice(0, 8)}</span>
            <span>User: {review.userName}</span>
            <span>Status: {review.statusName}</span>
          </div>
        </div>

        <div className="text-right flex flex-col items-end gap-2">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            Rp {formatCurrency(review.transaction_total || "0")}
          </div>
          <Badge className={getStatusColor(review.statusName ?? "")}>
            {review.statusName ?? "Status Tidak Diketahui"}
          </Badge>
          {showReviewButton && (
            <Button
              size="sm"
              onClick={() => handleReviewAction(review)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg flex items-center"
            >
              <CheckSquare className="w-4 h-4 mr-1" />
              Review
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Pending Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Klaim Menunggu Review</h2>
        <div className="space-y-4">
          {pendingReviews.length > 0
            ? pendingReviews.map((review) => renderCard(review, true))
            : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Tidak ada klaim menunggu review</h3>
              </div>
            )}
        </div>
      </div>

      {/* Completed Reviews */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Klaim yang Sudah Direview</h2>
        <div className="space-y-4">
          {completedReviews.length > 0
            ? completedReviews.map((review) => renderCard(review, false))
            : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Belum ada klaim yang direview</h3>
              </div>
            )}
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedReview && (
        <ReviewModal
          claim={selectedReview}
          statusList={statusList}
          currentUserId={currentUserId}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}
