import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Eye,
  FileCheck,
  Building,
  QrCode,
  DollarSign,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { PaymentMethod, PaymentTransaction, PaymentVerificationStatus } from '../types';

interface PaymentsProps {
  payments: PaymentTransaction[];
  onVerifyPayment: (
    id: string,
    status: 'VERIFIED' | 'REJECTED',
    reason?: string
  ) => Promise<PaymentTransaction>;
  searchTerm: string;
}

export const Payments: React.FC<PaymentsProps> = ({
  payments,
  onVerifyPayment,
  searchTerm,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [statusFilter, setStatusFilter] = useState<'ALL' | PaymentVerificationStatus>('ALL');
  const [methodFilter, setMethodFilter] = useState<'ALL' | PaymentMethod>('ALL');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleVerify = async (payment: PaymentTransaction) => {
    try {
      setActionLoading(true);
      await onVerifyPayment(payment.id, 'VERIFIED');
      setSelectedPayment(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (payment: PaymentTransaction) => {
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason');
      return;
    }
    try {
      setActionLoading(true);
      await onVerifyPayment(payment.id, 'REJECTED', rejectionReason);
      setIsRejecting(false);
      setRejectionReason('');
      setSelectedPayment(null);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'ALL' || p.method === methodFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.id.toLowerCase().includes(term) ||
      p.customerName.toLowerCase().includes(term) ||
      p.merchantName.toLowerCase().includes(term) ||
      (p.referenceNo && p.referenceNo.toLowerCase().includes(term));
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const pendingCount = payments.filter((p) => p.status === 'PENDING_VERIFICATION').length;
  const totalVerifiedAmount = payments
    .filter((p) => p.status === 'VERIFIED')
    .reduce((sum, p) => sum + p.amount, 0);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'BANK_TRANSFER':
        return <Building size={14} color="#0B1044" />;
      case 'QR_PAY':
        return <QrCode size={14} color="#0B1044" />;
      case 'CARD':
        return <CreditCard size={14} color="#0B1044" />;
      default:
        return <DollarSign size={14} color="#0B1044" />;
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Verification Metric Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: '#1E3A8A', fontWeight: 700 }}>Pending Verifications</div>
          <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: pendingCount > 0 ? '#991B1B' : '#000000' }}>
              {pendingCount} Transfers
            </div>
            <Clock size={24} color={pendingCount > 0 ? '#991B1B' : '#0B1044'} />
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: '#0B1044', fontWeight: 700 }}>Verified & Settled</div>
          <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#000000' }}>
              LKR {totalVerifiedAmount.toLocaleString()}
            </div>
            <ShieldCheck size={24} color="#0B1044" />
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Total Payment Transactions</div>
          <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#FFFFFF' }}>
              {payments.length} Records
            </div>
            <FileCheck size={24} color="#3B82F6" />
          </div>
        </div>
      </div>

      {/* Filter Strips */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div className="flex items-center gap-2">
          {(['ALL', 'PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn btn-sm"
              style={{
                background: statusFilter === st ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                color: statusFilter === st ? '#0F172A' : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {st === 'ALL'
                ? 'All Statuses'
                : st === 'PENDING_VERIFICATION'
                ? `Pending Verification (${pendingCount})`
                : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Method:</span>
          {(['ALL', 'BANK_TRANSFER', 'CARD', 'QR_PAY', 'CASH_ON_DELIVERY'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMethodFilter(m)}
              className="btn btn-sm"
              style={{
                background: methodFilter === m ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: methodFilter === m ? '#FFFFFF' : 'var(--text-muted)',
                padding: '4px 8px',
                fontSize: 11.5,
              }}
            >
              {m === 'ALL' ? 'All' : m.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer & Merchant</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Reference / Slip</th>
              <th>Verification Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No payment transactions found matching your filter.
                </td>
              </tr>
            ) : (
              filteredPayments.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    #{p.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{p.customerName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      To: {p.merchantName}
                    </div>
                  </td>
                  <td style={{ fontWeight: 800, fontSize: 14 }}>
                    LKR {p.amount.toLocaleString()}
                  </td>
                  <td>
                    <div className="flex items-center gap-2" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      {getMethodIcon(p.method)}
                      {p.method.replace('_', ' ')}
                    </div>
                  </td>
                  <td>
                    {p.slipUrl ? (
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="flex items-center gap-2"
                        style={{
                          background: 'rgba(245, 199, 72, 0.12)',
                          border: '1px solid rgba(245, 199, 72, 0.3)',
                          padding: '4px 10px',
                          borderRadius: 8,
                          cursor: 'pointer',
                          color: 'var(--color-primary)',
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        <Eye size={13} /> View Slip
                      </button>
                    ) : (
                      <code style={{ fontSize: 12, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                        {p.referenceNo || 'N/A'}
                      </code>
                    )}
                  </td>
                  <td>
                    {p.status === 'VERIFIED' ? (
                      <span className="badge badge-success">Verified</span>
                    ) : p.status === 'PENDING_VERIFICATION' ? (
                      <span className="badge badge-warning">Awaiting Verification</span>
                    ) : (
                      <span className="badge badge-danger">Rejected</span>
                    )}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedPayment(p)}
                      >
                        Inspect
                      </button>
                      {p.status === 'PENDING_VERIFICATION' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleVerify(p)}
                          disabled={actionLoading}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Verification & Bank Slip Inspector Modal */}
      {selectedPayment && (
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => {
            setSelectedPayment(null);
            setIsRejecting(false);
          }}
          title={`Verify Payment #${selectedPayment.id}`}
          maxWidth={640}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Amount & Overview Strip */}
            <div className="card" style={{ padding: 18, background: 'rgba(245, 199, 72, 0.08)', border: '1px solid rgba(245, 199, 72, 0.25)' }}>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Payment Amount</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-primary)', marginTop: 2 }}>
                    LKR {selectedPayment.amount.toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Method</div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: 14 }}>
                    {selectedPayment.method.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Transfer Slip Preview */}
            {selectedPayment.slipUrl && (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10, color: '#FFFFFF' }}>
                  Attached Bank Deposit Slip / Receipt:
                </div>
                <div
                  style={{
                    maxHeight: 280,
                    overflow: 'hidden',
                    borderRadius: 10,
                    border: '1px solid var(--border-dark)',
                    backgroundColor: '#000000',
                  }}
                >
                  <img
                    src={selectedPayment.slipUrl}
                    alt="Bank Slip"
                    style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
                  />
                </div>
                <div className="flex items-center justify-between" style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>Bank: <strong>{selectedPayment.bankName || 'Commercial Bank'}</strong></span>
                  <span>Ref: <strong>{selectedPayment.referenceNo || 'N/A'}</strong></span>
                </div>
              </div>
            )}

            {/* Rejection Note View or Input */}
            {selectedPayment.status === 'REJECTED' && selectedPayment.rejectionReason && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 10,
                  padding: 12,
                  color: '#EF4444',
                  fontSize: 13,
                }}
              >
                <strong>Rejection Reason:</strong> {selectedPayment.rejectionReason}
              </div>
            )}

            {isRejecting && (
              <div className="input-group">
                <label className="input-label" style={{ color: '#EF4444' }}>
                  Reason for Rejection *
                </label>
                <textarea
                  className="textarea-field"
                  rows={2}
                  placeholder="e.g. Deposit amount does not match invoice, or slip image is unreadable..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
              <div>
                {selectedPayment.status === 'VERIFIED' && (
                  <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 700 }}>
                    ✓ Verified by {selectedPayment.verifiedBy || 'Admin'}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {selectedPayment.status === 'PENDING_VERIFICATION' ? (
                  <>
                    {!isRejecting ? (
                      <>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setIsRejecting(true)}
                          disabled={actionLoading}
                        >
                          <XCircle size={14} /> Reject Payment
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleVerify(selectedPayment)}
                          disabled={actionLoading}
                        >
                          <CheckCircle size={16} /> Approve & Verify Slip
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setIsRejecting(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleReject(selectedPayment)}
                          disabled={actionLoading}
                        >
                          Confirm Rejection
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedPayment(null)}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
