"use client"

import { useState } from "react"
import { FileText, Clock, CheckCircle, Plus } from 'lucide-react'
import { getClaimsForEmployee } from "@/lib/data"
import ClaimCard from "./claim-card"
import ClaimSubmissionForm from "./claim-submission-form"
import { Button } from "@/components/ui/button"
import type { Claim } from "@/lib/data"

export default function EmployeeDashboard() {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)
  const claims = getClaimsForEmployee("EMP-001") // Assuming current user is EMP-001
  
  const handleNewClaim = () => {
    setShowSubmissionForm(true)
  }

  const handleCloseSubmissionForm = () => {
    setShowSubmissionForm(false)
  }

  // Calculate statistics
  const totalClaims = claims.length
  const pendingClaims = claims.filter(claim => claim.status === 'pending').length
  const approvedClaims = claims.filter(claim => claim.status === 'approved' || claim.status === 'paid').length

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Employee Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Kelola pengajuan klaim dan lihat status klaim Anda
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Klaim
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalClaims}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Semua klaim
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Pending
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {pendingClaims}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Menunggu review
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 dark:bg-yellow-950/30 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Approved
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {approvedClaims}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Disetujui
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {/* <div className="flex justify-center">
        <Button 
          onClick={handleNewClaim}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          Buat Klaim Baru
        </Button>
      </div> */}

      {/* Recent Claims */}
      {/* <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Klaim Terbaru
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {claims.length} klaim
          </div>
        </div>

        <div className="grid gap-6">
          {claims.slice(0, 5).map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              showActions={false}
            />
          ))}
        </div>
      </div> */}

      {/* Claim Submission Form */}
      {showSubmissionForm && (
        <ClaimSubmissionForm
          onClose={handleCloseSubmissionForm}
        />
      )}
    </div>
  )
}
