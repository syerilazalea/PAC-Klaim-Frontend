"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clipboard, DollarSign, FileText, X } from "lucide-react";

interface Claim {
  id: string;
  user_id: string;
  type?: string;
  total_claim?: number;
  status_id?: string;
  description?: string;
  created_at: string;
}

interface Status {
  id: string;
  name: string;
}

interface Review {
  claim_id: string;
  status_id: string;
  description?: string;
  user_id: string; 
}

interface ReviewDetailModalProps {
  claim: Claim;
  statusList: Status[];
  currentUserId: string; // user yg login
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

export default function ReviewDetailModal({ claim, statusList, currentUserId, onClose, onSubmit }: ReviewDetailModalProps) {
  const [statusId, setStatusId] = useState<string>(claim.status_id || "");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = () => {
  if (!statusId) return alert("Pilih status terlebih dahulu");

  onSubmit({
    claim_id: claim.id,
    status_id: statusId,
    description,
    user_id: currentUserId // <-- PASTIKAN INI MENGGUNAKAN currentUserId
  });

  onClose();
};


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg w-full max-w-2xl p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5" /> Detail Klaim
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="w-4 h-4" /></Button>
        </div>

        <div className="mb-6 space-y-3 text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> <strong>Tanggal Klaim:</strong> {formatDate(claim.created_at)}</p>
          <p className="flex items-center gap-2"><Clipboard className="w-4 h-4" /> <strong>Jenis Klaim:</strong> {claim.type ?? "-"}</p>
          <p className="flex items-center gap-2"><DollarSign className="w-4 h-4" /> <strong>Total Klaim:</strong> {claim.total_claim ?? "-"}</p>
          <p className="flex items-center gap-2"><FileText className="w-4 h-4" /> <strong>Deskripsi Klaim:</strong> {claim.description ?? "-"}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={statusId}
              onChange={e => setStatusId(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
            >
              <option value="">Pilih Status</option>
              {statusList.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Deskripsi Review</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tambahkan catatan review"
              className="w-full border rounded-xl px-3 py-2 dark:bg-gray-800 dark:border-gray-700"
              rows={4}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Batal</Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm" onClick={handleSubmit}>Simpan</Button>
        </div>
      </div>
    </div>
  );
}
