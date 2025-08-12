'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Hash } from 'lucide-react';

export type Payment = {
  id: string;
  note?: string;
  proof?: string;
  bank?: string;
  created_at: string;
  user_id: string;
  claim?: {
    id: string;
    employee_name: string;
    amount: string;
    description: string;
    category: string;
    status: string;
    submission_date?: string;
    approval_date?: string;
    review_date?: string;
    nik: string;
    notes?: string;
    reviewed_by?: string;
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800';
    case 'pending':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800';
    case 'paid':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Medis':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800';
    case 'Pembelian Barang':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800';
    case 'Perjalanan Dinas':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800';
  }
};

const formatCurrency = (amount: string) => {
  if (!amount) return '-';
  return new Intl.NumberFormat('id-ID').format(parseInt(amount.replace(/\./g, '')));
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'approved':
      return 'Disetujui';
    case 'rejected':
      return 'Ditolak';
    case 'pending':
      return 'Pending';
    case 'paid':
      return 'Dibayar';
    default:
      return status;
  }
};

export default function PaymentCard({ payment }: { payment: Payment }) {
  const claim = payment.claim;

  return (
    <Card className="mb-6 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {claim?.employee_name
                ? claim.employee_name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                : '?'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {claim?.employee_name || 'Unknown Employee'}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {claim?.category && (
                  <Badge variant="outline" className={getCategoryColor(claim.category)}>
                    {claim.category}
                  </Badge>
                )}
                {claim?.status && (
                  <Badge variant="outline" className={getStatusColor(claim.status)}>
                    {getStatusText(claim.status)}
                  </Badge>
                )}
                {claim?.id && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {claim.id}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Rp {claim ? formatCurrency(claim.amount) : '-'}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {claim?.reviewed_by && `Oleh ${claim.reviewed_by}`}
            </div>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {claim?.description || '-'}
        </p>

        {claim?.notes && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Catatan:</strong> {claim.notes}
            </p>
          </div>
        )}

        <div className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          <p>
            <strong>Bank:</strong> {payment.bank || '-'}
          </p>
          <p>
            <strong>Note:</strong> {payment.note || '-'}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(payment.created_at).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{claim?.nik || '-'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                {claim?.approval_date || claim?.review_date || claim?.submission_date || '-'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
