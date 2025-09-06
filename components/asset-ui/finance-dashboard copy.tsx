"use client";

import { useState, useEffect } from "react";
import { FileText, Wallet, TrendingUp, CreditCard } from 'lucide-react';
import type { Payment } from "@/lib/data";
import PaymentForm from "./payment-form";

export default function FinanceDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  // Fetch payments dari API/database
  const fetchPayments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`);
      if (!res.ok) throw new Error("Gagal fetch payments");
      const data = await res.json();
      setPayments(data);
    } catch (error) {
      console.error("Error fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Statistik
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + parseInt(p.claim.transaction_total), 0);
  const averageAmount = totalAmount / totalPayments || 0;
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID').format(amount);

  const handleOpenPaymentForm = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentForm(true);
  };

  const handleClosePaymentForm = () => {
    setSelectedPayment(null);
    setShowPaymentForm(false);
    fetchPayments(); // refresh data setelah submit
  };

  if (loading) return <p className="text-center py-16">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header & Statistik Cards */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">Kelola pembayaran klaim yang telah disetujui</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Klaim Siap Bayar</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalPayments}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Menunggu pembayaran</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Pembayaran</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">Rp {formatCurrency(totalAmount)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Siap diproses</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rata-rata Klaim</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">Rp {formatCurrency(Math.round(averageAmount))}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Per klaim</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Payments */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Daftar Pembayaran</h2>
        <div className="grid gap-6">
          {payments.map((p) => (
            <div key={p.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition-all duration-200 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{p.claim.desc1} - {p.claim.desc2}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{p.note}</p>
                <p className="text-gray-900 dark:text-white mt-2">Rp {formatCurrency(parseInt(p.claim.transaction_total))}</p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">Bank: {p.bank}</p>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                onClick={() => handleOpenPaymentForm(p)}
              >
                Edit / Bayar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedPayment && (
        <PaymentForm
          claim={selectedPayment.claim} // kirim claim object
          onClose={handleClosePaymentForm}
        />
      )}
    </div>
  );
}
