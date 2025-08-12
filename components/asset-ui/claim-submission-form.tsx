"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Upload, Calendar, DollarSign } from 'lucide-react'

interface ClaimFormData {
  claimTypeId: string
  desc1: string
  desc2: string
  transactionDate: string
  transactionTotal: string
  description: string
  attachment: string
}

interface ClaimSubmissionFormProps {
  onClose: () => void
}

const CLAIM_TYPES = [
  { id: "ct-001", name: "Medis", description: "Klaim kesehatan dan pengobatan" },
  { id: "ct-002", name: "Pembelian Barang", description: "Pembelian peralatan kerja" },
  { id: "ct-003", name: "Perjalanan Dinas", description: "Biaya perjalanan dinas" },
  { id: "ct-004", name: "Training", description: "Biaya pelatihan dan sertifikasi" },
  { id: "ct-005", name: "Lain-lain", description: "Klaim lainnya" }
]

export default function ClaimSubmissionForm({ onClose }: ClaimSubmissionFormProps) {
  const [formData, setFormData] = useState<ClaimFormData>({
    claimTypeId: "",
    desc1: "",
    desc2: "",
    transactionDate: "",
    transactionTotal: "",
    description: "",
    attachment: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Here you would typically make an API call to save the claim
    console.log("Claim data:", {
      id: crypto.randomUUID(), // Generate UUID
      userId: "user-001", // Current user ID
      statusId: "status-pending", // Default pending status
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...formData
    })

    setIsSubmitting(false)
    onClose()
  }

  const handleInputChange = (field: keyof ClaimFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '')
    return new Intl.NumberFormat('id-ID').format(parseInt(number) || 0)
  }

  const handleAmountChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    handleInputChange('transactionTotal', cleanValue)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Buat Klaim Baru
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Isi formulir untuk mengajukan klaim baru
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
          
          {/* Claim Type */}
          <div className="space-y-3">
            <Label htmlFor="claimType" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jenis Klaim *
            </Label>
            <Select
              value={formData.claimTypeId}
              onValueChange={(value) => handleInputChange("claimTypeId", value)}
            >
              <SelectTrigger className="h-12 rounded-xl border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Pilih jenis klaim" />
              </SelectTrigger>
              <SelectContent>
                {CLAIM_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div>
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="desc1" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi Singkat 1 *
              </Label>
              <Input
                id="desc1"
                value={formData.desc1}
                onChange={(e) => handleInputChange("desc1", e.target.value)}
                placeholder="Deskripsi singkat klaim"
                maxLength={200}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {formData.desc1.length}/200
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="desc2" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Deskripsi Singkat 2
              </Label>
              <Input
                id="desc2"
                value={formData.desc2}
                onChange={(e) => handleInputChange("desc2", e.target.value)}
                placeholder="Deskripsi tambahan (opsional)"
                maxLength={200}
                className="h-12 rounded-xl border-gray-200 dark:border-gray-700"
              />
              <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                {formData.desc2.length}/200
              </div>
            </div>
          </div>

          {/* Transaction Date & Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="transactionDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Transaksi *
              </Label>
              <div className="relative">
                <Input
                  id="transactionDate"
                  type="date"
                  value={formData.transactionDate}
                  onChange={(e) => handleInputChange("transactionDate", e.target.value)}
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                />
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="transactionTotal" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Nominal *
              </Label>
              <div className="relative">
                <Input
                  id="transactionTotal"
                  value={formatCurrency(formData.transactionTotal)}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0"
                  className="h-12 rounded-xl border-gray-200 dark:border-gray-700 pl-12"
                />
                <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Deskripsi Detail
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Jelaskan detail klaim Anda..."
              rows={4}
              className="rounded-xl border-gray-200 dark:border-gray-700 resize-none"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="attachment" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Lampiran
            </Label>
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload bukti transaksi atau dokumen pendukung
              </p>
              <Input
                id="attachment"
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    handleInputChange("attachment", file.name)
                  }
                }}
                className="max-w-xs mx-auto"
              />
            </div>
            {formData.attachment && (
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                <Upload className="w-4 h-4" />
                File terpilih: {formData.attachment}
              </div>
            )}
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
              disabled={isSubmitting || !formData.claimTypeId || !formData.desc1 || !formData.transactionDate || !formData.transactionTotal}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isSubmitting ? "Mengajukan..." : "Ajukan Klaim"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
