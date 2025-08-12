'use client';

import { useEffect, useState, FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

type Payment = {
  id: string;
  claim_id: string;
  review_id: string;
  payment_method_id?: string;
  bank?: string;
  note?: string;
  user_id: string;
  created_at: string;
};

export default function FinanceDashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [claimId, setClaimId] = useState('');
  const [reviewId, setReviewId] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('');
  const [bank, setBank] = useState('');
  const [note, setNote] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`);
      if (!res.ok) {
        throw new Error('Failed to fetch payments');
      }
      const data = await res.json();
      setPayments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          claim_id: claimId,
          review_id: reviewId,
          payment_method_id: paymentMethodId || null,
          bank: bank || null,
          note: note || null,
          user_id: userId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      // Reset form
      setClaimId('');
      setReviewId('');
      setPaymentMethodId('');
      setBank('');
      setNote('');
      setUserId('');

      // Refresh payment list
      fetchPayments();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Finance Dashboard</h2>

      {error && <p className="text-red-500 mb-4">Error: {error}</p>}

      {/* Form Insert Payment */}
      <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded-md bg-gray-50">
        <h3 className="text-lg font-semibold mb-4">Add New Payment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Claim ID *</label>
            <input
              type="text"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Review ID *</label>
            <input
              type="text"
              value={reviewId}
              onChange={(e) => setReviewId(e.target.value)}
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Payment Method ID</label>
            <input
              type="text"
              value={paymentMethodId}
              onChange={(e) => setPaymentMethodId(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Bank</label>
            <input
              type="text"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Note</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">User ID *</label>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full border rounded px-2 py-1"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Payment'}
        </button>
      </form>

      {/* Payments List */}
      <ScrollArea className="h-[500px] rounded-md border p-4">
        {payments.map((payment) => (
          <Card key={payment.id} className="mb-4">
            <CardContent className="p-4">
              <p><strong>ID:</strong> {payment.id}</p>
              <p><strong>Claim ID:</strong> {payment.claim_id}</p>
              <p><strong>Review ID:</strong> {payment.review_id}</p>
              <p><strong>Bank:</strong> {payment.bank || '-'}</p>
              <p><strong>Note:</strong> {payment.note || '-'}</p>
              <p><strong>Created:</strong> {new Date(payment.created_at).toLocaleString()}</p>
              <div className="mt-2">
                <Badge variant="outline">User ID: {payment.user_id}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
}
