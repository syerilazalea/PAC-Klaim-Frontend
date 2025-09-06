"use client"

import { useState, useEffect } from "react"
import { FileText, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export interface Claim {
  id: string
  desc1?: string
  desc2?: string
  transaction_total?: number | string
}

export interface PaymentMethod {
  id: string
  method: string
}

export interface PaymentProof {
  id?: string
  file_url: string
}

export interface Payment {
  id: string
  claim?: Claim
  bank?: string
  payment_method?: PaymentMethod
  proofs?: PaymentProof[]
}

export default function FinanceDashboard() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [totalClaims, setTotalClaims] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  // modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<Claim & { reviewId?: string } | null>(null)

  // form state
  const [bank, setBank] = useState("")
  const [method, setMethod] = useState("")
  const [note, setNote] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) throw new Error("Token tidak ditemukan, silakan login dulu.")

        const headers = {
          "Authorization": `Bearer ${token}`,
        }

        
        const [claimsRes, reviewsRes, paymentsRes, methodsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reviews`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payment-methods`, { headers }),
        ])

        
        if (!claimsRes.ok) console.error("Gagal fetch claims:", claimsRes.status)
        if (!reviewsRes.ok) console.error("Gagal fetch reviews:", reviewsRes.status)
        if (!paymentsRes.ok) console.error("Gagal fetch payments:", paymentsRes.status)
        if (!methodsRes.ok) console.error("Gagal fetch payment-methods:", methodsRes.status)

        if (!claimsRes.ok || !reviewsRes.ok || !paymentsRes.ok || !methodsRes.ok) {
          throw new Error("Gagal fetch salah satu resource")
        }

        const claimsData: Claim[] = await claimsRes.json()
        const reviewsData: any[] = await reviewsRes.json()
        const paymentsData: Payment[] = await paymentsRes.json()
        const methodsData: PaymentMethod[] = await methodsRes.json()

        const acceptedReviews = reviewsData.filter(r => r.status_id !== null)
        const claimsWithReview = acceptedReviews.map(review => {
          const claim = claimsData.find(c => c.id === review.claim_id)
          return {
            ...claim,
            reviewId: review.id,
          } as Claim & { reviewId: string }
        })

        const uniqueClaims: Claim[] = Array.from(
          new Map(claimsWithReview.map(c => [c.id, c])).values()
        )

        const uniquePayments: Payment[] = Array.from(
          new Map(paymentsData.map(p => [p.id, p])).values()
        )

        setClaims(uniqueClaims)
        setPayments(uniquePayments)
        setPaymentMethods(methodsData)
        setTotalClaims(uniqueClaims.length)
        setTotalAmount(
          uniqueClaims.reduce((sum, c) => sum + (Number(c.transaction_total) || 0), 0)
        )
      } catch (err) {
        console.error("❌ Error fetching data:", err)
        alert("Terjadi kesalahan saat mengambil data. Cek console untuk detail.")
      }
    }

    fetchData()
  }, [])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID").format(amount)

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClaim) return
    if (!bank || !method) {
      alert("Bank dan metode pembayaran wajib diisi")
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token tidak ditemukan, silakan login dulu.")

      const formData = new FormData()
      formData.append("claim_id", selectedClaim.id)
      formData.append("review_id", selectedClaim.reviewId || "")
      formData.append("payment_method_id", method)
      formData.append("bank", bank)
      formData.append("note", note)
      if (file) formData.append("file", file)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errMsg = await res.text()
        throw new Error(`Gagal membuat pembayaran: ${errMsg}`)
      }

      const data = await res.json()
      const newPayment: Payment = Array.isArray(data) ? data[0] : data
      if (!newPayment.id) newPayment.id = crypto.randomUUID()

      setPayments(prev => [newPayment, ...prev])
      setModalOpen(false)
      setBank("")
      setMethod("")
      setNote("")
      setFile(null)
      setSelectedClaim(null)
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan saat membuat pembayaran")
    } finally {
      setLoading(false)
    }
  }

  return (
  <div className="space-y-8">
    {/* Statistik */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Klaim Siap Bayar
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {totalClaims}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total Pembayaran
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              Rp {formatCurrency(totalAmount)}
            </p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </div>
    </div>

    {/* Klaim Siap Bayar */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Klaim Siap Bayar</h2>
      <div className="space-y-4">
        {claims.map(claim => (
          <div key={claim.id} className="bg-white dark:bg-gray-900 rounded-xl border p-4">
            <p className="font-medium text-gray-900 dark:text-white">{claim.desc1 || "Tanpa deskripsi"}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{claim.desc2 || "-"}</p>
            <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              Rp {formatCurrency(Number(claim.transaction_total) || 0)}
            </p>
            <Button className="mt-3" onClick={() => { setSelectedClaim(claim); setModalOpen(true) }}>
              Bayar
            </Button>
          </div>
        ))}
      </div>
    </div>

    {/* Sudah Dibayar */}
    <div>
      <h2 className="text-lg font-semibold mb-4">Sudah Dibayar</h2>
      <div className="space-y-4">
        {payments.map(payment => (
          <div key={payment.id} className="bg-white dark:bg-gray-900 rounded-xl border p-4">
            <p className="font-medium text-gray-900 dark:text-white">{payment.claim?.desc1}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{payment.claim?.desc2}</p>
            <p className="mt-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              Rp {formatCurrency(Number(payment.claim?.transaction_total) || 0)}
            </p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Bank: {payment.bank}</span>
              <span>Metode: {payment.payment_method?.method || "Tidak ada"}</span>
            </div>
            {(payment.proofs ?? []).length > 0 && (
              <div className="mt-2 flex gap-2">
                {(payment.proofs ?? []).map((p, idx) => (
                  <img
                    key={p.id ?? `proof-${idx}`}
                    src={p.file_url}
                    alt="Bukti pembayaran"
                    className="w-20 h-20 rounded-lg border object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Modal Pembayaran */}
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Pembayaran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmitPayment} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Bank</label>
            <input type="text" className="w-full border rounded p-2" value={bank} onChange={e => setBank(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Metode Pembayaran</label>
            <select className="w-full border rounded p-2" value={method} onChange={e => setMethod(e.target.value)} required>
              <option value="">-- Pilih Metode --</option>
              {paymentMethods.map(pm => (
                <option key={pm.id} value={pm.id}>{pm.method}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Note</label>
            <textarea className="w-full border rounded p-2" value={note} onChange={e => setNote(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Upload Bukti</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Pembayaran"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  </div>
)
}
