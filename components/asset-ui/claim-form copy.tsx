"use client";

import React, { useState } from "react";

interface ClaimSubmissionFormProps {
  onClose: () => void;
}

export default function ClaimSubmissionForm({ onClose }: ClaimSubmissionFormProps) {
  const [userId, setUserId] = useState("uuid-user-id-ini"); // ganti sesuai user login
  const [claimTypeId, setClaimTypeId] = useState("uuid-claim-type");
  const [desc1, setDesc1] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!transactionDate || transactionTotal <= 0) {
      alert("Isi tanggal dan nominal transaksi");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("claim_type_id", claimTypeId);
    formData.append("desc1", desc1);
    formData.append("transaction_date", transactionDate);
    formData.append("transaction_total", transactionTotal.toString());

    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]); // harus 'files' sesuai interceptor backend
      }
    }

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/claims`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal mengirim klaim");
      }

      alert("Klaim berhasil dikirim");
      onClose();
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 relative"
          onClick={(e) => e.stopPropagation()} // prevent close when clicking inside form
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Buat Klaim Baru
          </h2>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">User ID (UUID)</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Claim Type ID (UUID)</label>
            <input
              type="text"
              value={claimTypeId}
              onChange={(e) => setClaimTypeId(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea
              value={desc1}
              onChange={(e) => setDesc1(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Tanggal Transaksi</label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Total Transaksi</label>
            <input
              type="number"
              value={transactionTotal}
              onChange={(e) => setTransactionTotal(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              required
              min={0}
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Attachment (File)</label>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(e.target.files)}
              className="w-full"
            />
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Klaim"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
