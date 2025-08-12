"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, CheckCircle, XCircle, Clock, User, DollarSign } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import type { Claim } from "@/lib/data"

interface ReviewFormData {
  statusId: string
  description: string
}

interface ReviewFormProps {
  claim: Claim
  onClose: () => void
}

const STATUS_OPTIONS = [
  { 
    id: "status-approved", 
    name: "Disetujui", 
    description: "Klaim disetujui dan akan diproses untuk pembayaran",
    color: "text-emerald-600 dark:text-emerald-400",
    icon: CheckCircle
  },
  { 
    id: "status-rejected", 
    name: "Ditolak", 
    description: "Klaim ditolak karena tidak memenuhi kriteria",
    color: "text-red-600 dark:text-red-400",
    icon: XCircle
  },
  { 
    id: "status-pending", 
    name: "Butuh Info Tambahan", 
    description: "Memerlukan informasi atau dokumen tambahan",
    color: "text-yellow-600 dark:text-yellow-400",
    icon: Clock
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

const formatCurrency = (amount: string) => {
  return new Intl.NumberFormat('id-ID').format(parseInt(amount.replace(/\./g, '')))
}

export default function ReviewForm({ claim, onClose }: ReviewFormProps) {
  const [formData, setFormData] = useState<ReviewFormData>({
    statusId: "",
    description: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Here you would typically make an API call to save the review
    console.log("Review data:", {
      id: crypto.randomUUID(), // Generate UUID
      userId: "hr-user-001", // Current HR user ID
      claimId: claim.id,
      statusId: formData.statusId,
      description: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    setIsSubmitting(false)
    onClose()
  }

  const handleInputChange = (field: keyof ReviewFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const selectedStatus = STATUS_OPTIONS.find(status => status.id === formData.statusId)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Review Klaim
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

        <div className="p-8 space-y-8">
          
          {/* Claim Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {claim.employeeName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {claim.employeeName}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={getCategoryColor(claim.category)}>
                      {claim.category}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {claim.nik}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2">
                  <DollarSign className="w-8 h-8" />
                  Rp {formatCurrency(claim.amount)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Diajukan {claim.submissionDate}
                </div>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {claim.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Status Selection */}
            <div className="space-y-4">
              <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Keputusan Review *
              </Label>
              <Select
                value={formData.statusId}
                onValueChange={(value) => handleInputChange("statusId", value)}
              >
                <SelectTrigger className="h-14 rounded-xl border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Pilih keputusan review" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.id} value={status.id}>
                      <div className="flex items-center gap-3 py-2">
                        <status.icon className={`w-5 h-5 ${status.color}`} />
                        <div>
                          <div className="font-medium">{status.name}</div>
                          <div className="text-xs text-gray-500">{status.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedStatus && (
                <div className={`flex items-center gap-2 text-sm ${selectedStatus.color} bg-gray-50 dark:bg-gray-800 rounded-lg p-3`}>
                  <selectedStatus.icon className="w-4 h-4" />
                  {selectedStatus.description}
                </div>
              )}
            </div>

            {/* Review Notes */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Catatan Review *
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder={
                  formData.statusId === "status-approved" 
                    ? "Berikan catatan persetujuan dan instruksi untuk finance..."
                    : formData.statusId === "status-rejected"
                    ? "Jelaskan alasan penolakan klaim..."
                    : "Jelaskan informasi tambahan yang diperlukan..."
                }
                rows={6}
                className="rounded-xl border-gray-200 dark:border-gray-700 resize-none"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Catatan ini akan dilihat oleh karyawan dan tim finance
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
                disabled={isSubmitting || !formData.statusId || !formData.description.trim()}
                className={`px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                  formData.statusId === "status-approved" 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : formData.statusId === "status-rejected"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {isSubmitting ? "Memproses..." : "Simpan Review"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
