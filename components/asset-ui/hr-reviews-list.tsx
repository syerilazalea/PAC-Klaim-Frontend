"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, FileCheck, Calendar, Clock } from "lucide-react";
import type { Claim } from "@/lib/data";
import ReviewModal from "./review-modal";

interface User {
  id: string;
  name: string;
  nik?: string;
}

interface Status {
  id: string;
  name: string;
}

interface ReviewWithDetails {
  claimId: string;
  userName: string;
  statusName: string;
  description?: string;
  createdAt: string;
}

export default function HRReviewsList() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [pendingReviews, setPendingReviews] = useState<ReviewWithDetails[]>([]);
  const [completedReviews, setCompletedReviews] = useState<ReviewWithDetails[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [statusMap, setStatusMap] = useState<Record<string, Status>>({});
  const [claimsData, setClaimsData] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);


useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      setCurrentUserId(userId);
    }
  }, []);

  const getDaysAgo = (dateString: string) => {
    const submissionDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - submissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 hari yang lalu";
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`;
    return `${Math.floor(diffDays / 30)} bulan yang lalu`;
  };

  const fetchClaimsAndUsers = async () => {
    try {
      const [resClaims, resUsers, resStatus] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/statuses`)
      ]);

      if (!resClaims.ok || !resUsers.ok || !resStatus.ok) throw new Error("Gagal fetch data");

      const claims: Claim[] = await resClaims.json();
      setClaimsData(claims);

      const users: User[] = await resUsers.json();
      const statusList: Status[] = await resStatus.json();

      const usersTemp: Record<string, User> = {};
      users.forEach(u => (usersTemp[u.id] = u));
      setUsersMap(usersTemp);

      const statusTemp: Record<string, Status> = {};
      statusList.forEach(s => (statusTemp[s.id] = s));
      setStatusMap(statusTemp);

      const pending: ReviewWithDetails[] = [];
      const completed: ReviewWithDetails[] = [];

      claims.forEach((claim: Claim) => {
        const reviewItem: ReviewWithDetails = {
          claimId: claim.id,
          userName: usersTemp[claim.user_id]?.name ?? "Nama tidak diketahui",
          statusName: statusTemp[claim.status_id ?? ""]?.name ?? "Pending",
          description: claim.description,
          createdAt: claim.created_at
        };

        if (claim.status_id === "approved") {
          completed.push(reviewItem);
        } else {
          pending.push(reviewItem);
        }
      });

      setPendingReviews(pending);
      setCompletedReviews(completed);
    } catch (error) {
      console.error("Error fetch claims & reviews:", error);
    }
  };

  useEffect(() => {
    fetchClaimsAndUsers();
  }, []);

  const handleOpenReviewModal = (claimId: string) => {
    const claim = claimsData.find(c => c.id === claimId);
    if (claim) {
      setSelectedClaim(claim);
      setShowReviewModal(true);
    }
  };

  const handleCloseReviewModal = () => {
    setSelectedClaim(null);
    setShowReviewModal(false);
  };

  const handleSubmitReview = async (reviewData: any) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData)
      });
      fetchClaimsAndUsers();
    } catch (error) {
      console.error("Error submit review:", error);
    }
  };

  const ReviewItem = ({ review }: { review: ReviewWithDetails }) => (
    <div
      onClick={() => handleOpenReviewModal(review.claimId)}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg cursor-pointer p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{review.userName}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{review.description ?? "-"}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{new Date(review.createdAt).toLocaleDateString("id-ID")}</span>
            <Clock className="w-3 h-3" />
            <span>{getDaysAgo(review.createdAt)}</span>
            <span className="text-gray-400">{review.claimId}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-right">
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">{review.statusName}</Badge>
          <div className="flex gap-2 justify-end mt-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={e => {
                e.stopPropagation();
                handleOpenReviewModal(review.claimId);
              }}
            >
              <Eye className="w-4 h-4 mr-1" /> Detail / Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (currentUserId === null) {
    return <div>Loading...</div>;
  }

  if (!currentUserId) {
    return <div>Error: User ID not found. Please login again.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Klaim</h1>
        <p className="text-gray-500 dark:text-gray-400">{pendingReviews.length} klaim menunggu review Anda</p>
      </div>
      <div className="space-y-4">
        {pendingReviews.map(review => <ReviewItem key={review.claimId} review={review} />)}
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Review Selesai</h1>
        <p className="text-gray-500 dark:text-gray-400">{completedReviews.length} klaim telah direview</p>
      </div>
      <div className="space-y-4">
        {completedReviews.map(review => <ReviewItem key={review.claimId} review={review} />)}
      </div>

      {showReviewModal && selectedClaim && currentUserId && (
  <ReviewModal
    claim={selectedClaim}
    statusList={Object.values(statusMap)}
    currentUserId={currentUserId}
    onClose={handleCloseReviewModal}
    onSubmit={handleSubmitReview}
  />
)}
    </div>
  );
}
