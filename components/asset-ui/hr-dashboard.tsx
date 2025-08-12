"use client"

import { useState } from "react"
import { FileText, UserCheck, TrendingUp, FileCheck } from 'lucide-react'
import { SAMPLE_CLAIMS, getClaimsForHR } from "@/lib/data"
import ClaimCard from "./claim-card"
import type { Claim } from "@/lib/data"

export default function HRDashboard() {
  const pendingClaims = getClaimsForHR()
  const reviewedClaims = SAMPLE_CLAIMS.filter(claim => claim.reviewDate)
  
  const handleReviewClaim = (claim: Claim) => {
    console.log("Review claim:", claim)
    // Handle review logic here
  }

  // Calculate statistics
  const totalPending = pendingClaims.length
  const totalReviewed = reviewedClaims.length
  const approvalRate = totalReviewed > 0 ? (reviewedClaims.filter(c => c.status === 'approved').length / totalReviewed * 100) : 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          HR Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Kelola review dan persetujuan klaim karyawan
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalPending}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Menunggu review
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Reviewed
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalReviewed}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sudah direview
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Approval Rate
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {approvalRate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Tingkat persetujuan
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pending Reviews
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {pendingClaims.length} klaim menunggu
          </div>
        </div>

        <div className="grid gap-6">
          {pendingClaims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onAction={handleReviewClaim}
              actionLabel="Review"
              actionIcon={FileCheck}
            />
          ))}
        </div>
      </div>

      {/* Recently Reviewed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recently Reviewed
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {reviewedClaims.length} klaim
          </div>
        </div>

        <div className="grid gap-6">
          {reviewedClaims.slice(0, 3).map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              showActions={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
