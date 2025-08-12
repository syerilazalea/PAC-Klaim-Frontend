"use client";

import React, { useState } from "react";

interface ClaimSubmissionFormProps {
  onClose: () => void;
  onSubmit: (data: {
    user_name: string;
    claim_type_name: string;
    desc1: string;
    transaction_date: string;
    transaction_total: number;
    files: FileList | null;
  }) => void;
}

export default function ClaimSubmissionForm({ onClose, onSubmit }: ClaimSubmissionFormProps) {
  const [userName, setUserName] = useState("");
  const [claimTypeName, setClaimTypeName] = useState("");
  const [desc1, setDesc1] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [transactionTotal, setTransactionTotal] = useState(0);
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!transactionDate || transactionTotal <= 0) {
      alert("Isi tanggal dan nominal transaksi");
      return;
    }
    if (!userName.trim() || !claimTypeName.trim()) {
      alert("Isi nama user dan kategori klaim");
      return;
    }

    setLoading(true);
    // langsung panggil callback onSubmit dari parent
    onSubmit({
      user_name: userName,
      claim_type_name: claimTypeName,
      desc1,
      transaction_date: transactionDate,
      transaction_total: transactionTotal,
      files,
    });
    setLoading(false);
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
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Buat Klaim Baru</h2>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Nama User</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Masukkan nama user"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Kategori Klaim</label>
            <input
              type="text"
              value={claimTypeName}
              onChange={(e) => setClaimTypeName(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Masukkan kategori klaim"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">Deskripsi</label>
            <textarea
              value={desc1}
              onChange={(e) => setDesc1(e.target.value)}
              className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:text-white"
              placeholder="Deskripsi klaim"
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
