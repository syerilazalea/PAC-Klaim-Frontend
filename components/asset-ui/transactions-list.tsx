"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, CreditCard, Calendar, User, Hash, FileText, Wallet, TrendingUp } from 'lucide-react'
import PaymentForm from "./payment-form"

interface Claim {
  id: string
  claimId: string
  employeeName: string
  category: string
  description: string
  nik: string
  submissionDate: string
  approvalDate: string
  amount: string
  reviewId: string
  userId: string
}

const CLAIMS: Claim[] = [
  {
    id: "1",
    claimId: "CLM-2025-007",
    employeeName: "Putri Wulandari",
    category: "Medis",
    description: "Pemeriksaan kesehatan berkala dan pembelian vitamin",
    nik: "456123789",
    submissionDate: "20 Januari 2025",
    approvalDate: "22 Januari 2025",
    amount: "420.000",
    reviewId: "rev-001",
    userId: "user-001"
  },
  {
    id: "2",
    claimId: "CLM-2025-008",
    employeeName: "Indra Permana",
    category: "Pembelian Barang",
    description: "Pembelian monitor eksternal untuk workstation",
    nik: "789456123",
    submissionDate: "18 Januari 2025",
    approvalDate: "20 Januari 2025",
    amount: "1.250.000",
    reviewId: "rev-002",
    userId: "user-002"
  },
  {
    id: "3",
    claimId: "CLM-2025-009",
    employeeName: "Ahmad Fadli",
    category: "Perjalanan Dinas",
    description: "Perjalanan dinas ke Jakarta untuk training dan workshop",
    nik: "123456789",
    submissionDate: "22 Januari 2025",
    approvalDate: "24 Januari 2025",
    amount: "650.000",
    reviewId: "rev-003",
    userId: "user-003"
  }
]

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

// Helper function to format currency
const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID').format(parseInt(amount.replace(/\./g, '')))
}

export default function TransactionsList() {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handleProcessPayment = (claim: Claim) => {
    setSelectedClaim(claim)
    setShowPaymentForm(true)
  }

  const handleClosePaymentForm = () => {
    setShowPaymentForm(false)
    setSelectedClaim(null)
  }

  // Calculate statistics
  const totalClaims = CLAIMS.length
  const totalAmount = CLAIMS.reduce((sum, claim) => sum + parseInt(claim.amount.replace(/\./g, '')), 0)
  const averageAmount = totalAmount / totalClaims

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Klaim Siap Bayar
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Kelola dan proses pembayaran klaim karyawan
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Claims Card */}
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
                Menunggu pembayaran
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Amount Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Total Pembayaran
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                Rp {formatCurrency(totalAmount.toString())}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Siap diproses
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Average Amount Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Rata-rata Klaim
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                Rp {formatCurrency(Math.round(averageAmount).toString())}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Per klaim
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Claims List Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Daftar Klaim
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {CLAIMS.length} klaim menunggu
        </div>
      </div>

      {/* Claims Grid */}
      <div className="grid gap-6">
        {CLAIMS.map((claim) => (
          <div
            key={claim.id}
            className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
          >
            <div className="p-6">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {claim.employeeName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {claim.employeeName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={getCategoryColor(claim.category)}>
                        {claim.category}
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        {claim.claimId}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Amount */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    Rp {formatCurrency(claim.amount)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Disetujui
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                {claim.description}
              </p>

              {/* Details Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{claim.nik}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{claim.approvalDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
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
                    onClick={() => handleProcessPayment(claim)}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Bayar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedClaim && (
        <PaymentForm
          claim={selectedClaim}
          onClose={handleClosePaymentForm}
        />
      )}
    </div>
  )
}
