"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileCheck, Calendar, DollarSign, User, Clock } from 'lucide-react'
import { getClaimsForHR } from "@/lib/data"
import ClaimDetailModal from "./claim-detail-modal"
import ReviewForm from "./review-form"
import type { Claim } from "@/lib/data"

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Medis":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
    case "Pembelian Barang":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
    case "Perjalanan Dinas":
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800"
  }
}

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID').format(parseInt(amount.replace(/\./g, '')))
}

const getDaysAgo = (dateString: string) => {
  const submissionDate = new Date(dateString.split(' ').reverse().join('-'))
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - submissionDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return "1 hari yang lalu"
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu yang lalu`
  return `${Math.floor(diffDays / 30)} bulan yang lalu`
}

export default function HRReviewsList() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  
  const pendingClaims = getClaimsForHR() // Claims pending HR review

  const handleViewDetail = (claim: Claim) => {
    setSelectedClaim(claim)
    setShowDetailModal(true)
  }

  const handleReviewClaim = (claim: Claim, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    setSelectedClaim(claim)
    setShowReviewForm(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedClaim(null)
  }

  const handleCloseReviewForm = () => {
    setShowReviewForm(false)
    setSelectedClaim(null)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Review Klaim
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {pendingClaims.length} klaim menunggu review Anda
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Pending Review
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {pendingClaims.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Nilai
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                Rp {formatCurrency(pendingClaims.reduce((sum, claim) => sum + parseInt(claim.amount.replace(/\./g, '')), 0).toString())}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Rata-rata
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                Rp {formatCurrency(Math.round(pendingClaims.reduce((sum, claim) => sum + parseInt(claim.amount.replace(/\./g, '')), 0) / pendingClaims.length || 0).toString())}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {pendingClaims.map((claim) => (
          <div
            key={claim.id}
            onClick={() => handleViewDetail(claim)}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg cursor-pointer p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {claim.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {claim.employeeName}
                    </h3>
                    <Badge variant="outline" className={getCategoryColor(claim.category)}>
                      {claim.category}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                    {claim.description}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {claim.nik}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {claim.submissionDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getDaysAgo(claim.submissionDate)}
                    </span>
                    <span className="text-gray-400">
                      {claim.claimId}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Rp {formatCurrency(claim.amount)}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewDetail(claim)
                    }}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleReviewClaim(claim, e)}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <FileCheck className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pendingClaims.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Tidak ada klaim untuk direview
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Semua klaim telah direview atau belum ada pengajuan baru
          </p>
        </div>
      )}

      {/* Claim Detail Modal */}
      {showDetailModal && selectedClaim && (
        <ClaimDetailModal
          claim={selectedClaim}
          onClose={handleCloseDetailModal}
        />
      )}

      {/* Review Form Modal */}
      {showReviewForm && selectedClaim && (
        <ReviewForm
          claim={selectedClaim}
          onClose={handleCloseReviewForm}
        />
      )}
    </div>
  )
}
