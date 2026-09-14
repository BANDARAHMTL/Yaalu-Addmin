import React, { useState } from 'react';
import { DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { formatShortId } from '../utils/formatId';
import { Invoice } from '../types';

interface InvoicesProps {
  invoices: Invoice[];
  onMarkPaid: (id: string) => Promise<Invoice>;
  searchTerm: string;
}

export const Invoices: React.FC<InvoicesProps> = ({ invoices, onMarkPaid, searchTerm }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handlePay = async (id: string) => {
    try {
      setLoadingId(id);
      await onMarkPaid(id);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const term = searchTerm.toLowerCase();
    return (
      inv.id.toLowerCase().includes(term) ||
      (inv.customerName && inv.customerName.toLowerCase().includes(term)) ||
      (inv.merchantName && inv.merchantName.toLowerCase().includes(term))
    );
  });

  const totalCollected = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.amount, 0);

  const totalPending = invoices
    .filter((i) => i.status === 'pending')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Financial Summary Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Total Invoiced Amount</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#FFFFFF', marginTop: 4 }}>
            LKR {(totalCollected + totalPending).toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: 'var(--color-success)' }}>Settled / Paid Revenue</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-success)', marginTop: 4 }}>
            LKR {totalCollected.toLocaleString()}
          </div>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, color: 'var(--color-warning)' }}>Outstanding Receivables</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--color-warning)', marginTop: 4 }}>
            LKR {totalPending.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Customer</th>
              <th>Merchant Outlet</th>
              <th>Invoice Amount</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    #{formatShortId(inv.id, 50000)}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {inv.customerName || 'Walk-in Customer'}
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {inv.merchantName || 'Central'}
                  </td>
                  <td style={{ fontWeight: 800 }}>
                    LKR {inv.amount.toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                      {inv.dueDate || 'Immediate'}
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={inv.status} type="invoice" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {inv.status === 'pending' ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePay(inv.id)}
                        disabled={loadingId === inv.id}
                      >
                        <CheckCircle2 size={14} /> Mark Paid
                      </button>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--color-success)', fontWeight: 600 }}>
                        Settled
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
