"use client"

import { useState } from "react"
import type { ClaimWithReview } from "./finance-dashboardd"
import { Button } from "@/components/ui/button"

interface PaymentFormProps {
  claim: ClaimWithReview
  onClose: () => void
}

export default function PaymentForm({ claim, onClose }: PaymentFormProps) {
  const [bank, setBank] = useState("")
  const [note, setNote] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!bank || !note) return alert("Lengkapi semua field")

    setLoading(true)
    try {
      const payload = {
        claim_id: claim.id,
        review_id: claim.reviewId,
        user_id: claim.user_id,
        bank,
        note,
        payment_method_id: "d1264546-3407-4fe7-8333-5f53c421e093" // contoh ID metode
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Gagal mengirim data ke backend")

      alert("Pembayaran berhasil!")
      onClose()
    } catch (err) {
      console.error(err)
      alert("Gagal mengirim data ke backend")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-96 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Form Pembayaran</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{claim.category} • {claim.userName}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Rp {claim.amount}</p>

        <input
          type="text"
          placeholder="Bank"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Catatan"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border p-2 rounded-lg"
        />

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Menyimpan..." : "Bayar"}
          </Button>
        </div>
      </div>
    </div>
  )
}
