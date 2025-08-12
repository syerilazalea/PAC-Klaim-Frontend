"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, CheckCircle } from 'lucide-react'

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

interface PaymentFormProps {
  claim: Claim
  onClose: () => void
}

const PAYMENT_METHODS = [
  { id: "pm-001", name: "Transfer Bank" },
  { id: "pm-002", name: "E-Wallet" },
  { id: "pm-003", name: "Cash" },
  { id: "pm-004", name: "Cek" }
]

export default function PaymentForm({ claim, onClose }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    paymentMethodId: "",
    bank: "",
    note: "",
    proof: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log("Payment data:", {
      claimId: claim.id,
      reviewId: claim.reviewId,
      userId: claim.userId,
      ...formData
    })

    setIsSubmitting(false)
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Proses Pembayaran
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {claim.employeeName} • {claim.claimId}
            </p>
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

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Claim Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Detail Klaim
              </h3>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                Rp {claim.amount}
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {claim.description}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            
            {/* Payment Method & Bank */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="paymentMethod" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Metode Pembayaran *
                </Label>
                <Select
                  value={formData.paymentMethodId}
                  onValueChange={(value) => handleInputChange("paymentMethodId", value)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method.id} value={method.id}>
                        {method.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="bank" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bank
                </Label>
                <Input
                  id="bank"
                  value={formData.bank}
                  onChange={(e) => handleInputChange("bank", e.target.value)}
                  placeholder="Nama bank (opsional)"
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-3">
              <Label htmlFor="note" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Catatan
              </Label>
              <Textarea
                id="note"
                value={formData.note}
                onChange={(e) => handleInputChange("note", e.target.value)}
                placeholder="Tambahkan catatan pembayaran..."
                rows={4}
                className="rounded-xl border-gray-200 dark:border-gray-700 resize-none"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-3">
              <Label htmlFor="proof" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bukti Pembayaran
              </Label>
              <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload bukti pembayaran
                </p>
                <Input
                  id="proof"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleInputChange("proof", file.name)
                    }
                  }}
                  className="max-w-xs mx-auto"
                />
              </div>
              {formData.proof && (
                <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4" />
                  File terpilih: {formData.proof}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.paymentMethodId}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? "Memproses..." : "Proses Pembayaran"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
