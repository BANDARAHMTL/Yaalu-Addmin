import React, { useState } from 'react';
import { Store, CheckCircle, XCircle, Eye, ShieldAlert, Phone, Mail, MapPin, Building, CreditCard } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Merchant } from '../types';

interface MerchantsProps {
  merchants: Merchant[];
  onVerify: (id: string, isVerified: boolean) => Promise<void>;
  onUpdateStatus: (id: string, status: Merchant['status']) => Promise<void>;
  searchTerm: string;
}

export const Merchants: React.FC<MerchantsProps> = ({
  merchants,
  onVerify,
  onUpdateStatus,
  searchTerm,
}) => {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'>('ALL');
  const [actionLoading, setActionLoading] = useState(false);

  const filteredMerchants = merchants.filter((m) => {
    const matchesFilter = filter === 'ALL' || m.status === filter;
    const matchesSearch =
      m.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.ownerName && m.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.businessType && m.businessType.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleVerifyAction = async (merchant: Merchant, verify: boolean) => {
    try {
      setActionLoading(true);
      await onVerify(merchant.id, verify);
      setSelectedMerchant(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusChange = async (merchant: Merchant, newStatus: Merchant['status']) => {
    try {
      setActionLoading(true);
      await onUpdateStatus(merchant.id, newStatus);
      if (selectedMerchant?.id === merchant.id) {
        setSelectedMerchant({ ...selectedMerchant, status: newStatus });
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Controls & Filter Chips */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['ALL', 'ACTIVE', 'PENDING_APPROVAL', 'SUSPENDED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className="btn btn-sm"
              style={{
                background: filter === tab ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                color: filter === tab ? '#0F172A' : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {tab === 'ALL' ? 'All Shops' : tab === 'PENDING_APPROVAL' ? 'Pending Approval' : tab}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Showing {filteredMerchants.length} partner shops
        </div>
      </div>

      {/* Merchants Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Shop & Outlet</th>
              <th>Owner & Contact</th>
              <th>Category</th>
              <th>Registration No</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMerchants.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No merchants found matching your query.
                </td>
              </tr>
            ) : (
              filteredMerchants.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <img
                        src={m.logoUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                        alt={m.shopName}
                        style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                          {m.shopName}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {m.shopAddress || 'Address on file'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.ownerName || 'Merchant Owner'}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {m.ownerPhone || m.ownerEmail || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                      {m.businessType || 'Retail Grocery'}
                    </span>
                  </td>
                  <td>
                    <code style={{ fontSize: 12, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {m.registrationNo || 'BR-PENDING'}
                    </code>
                  </td>
                  <td>
                    <StatusBadge status={m.status} type="merchant" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedMerchant(m)}
                        title="View Full Profile"
                      >
                        <Eye size={14} /> Details
                      </button>
                      {m.status === 'PENDING_APPROVAL' && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleVerifyAction(m, true)}
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

      {/* Merchant Profile Details Modal */}
      {selectedMerchant && (
        <Modal
          isOpen={!!selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
          title={`Shop Profile: ${selectedMerchant.shopName}`}
          maxWidth={650}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header / Banner preview */}
            <div
              style={{
                position: 'relative',
                height: 120,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: '#1E293B',
              }}
            >
              <img
                src={
                  selectedMerchant.bannerUrl ||
                  'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800'
                }
                alt="Banner"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 12,
                  left: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <img
                  src={
                    selectedMerchant.logoUrl ||
                    'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'
                  }
                  alt="Logo"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 12,
                    border: '2px solid #FFFFFF',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Business Category
                </div>
                <div className="flex items-center gap-2" style={{ fontWeight: 600 }}>
                  <Building size={16} color="var(--color-primary)" />
                  {selectedMerchant.businessType || 'Supermarket & Grocery'}
                </div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Business Reg No (BR)
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedMerchant.registrationNo || 'Under Verification'}
                </div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Owner Name & Phone
                </div>
                <div style={{ fontWeight: 600 }}>{selectedMerchant.ownerName || 'N/A'}</div>
                <div className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  <Phone size={12} /> {selectedMerchant.ownerPhone || 'N/A'}
                </div>
              </div>

              <div className="card" style={{ padding: 16 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Owner Email
                </div>
                <div className="flex items-center gap-1" style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                  <Mail size={12} /> {selectedMerchant.ownerEmail || 'N/A'}
                </div>
              </div>
            </div>

            {/* Bank Payout Info Card */}
            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8, fontWeight: 700 }}>
                <CreditCard size={18} color="var(--color-primary)" /> Banking & Settlement Details
              </div>
              <div className="grid grid-cols-3 gap-2" style={{ fontSize: 13 }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Bank:</span>
                  <div style={{ fontWeight: 600 }}>{selectedMerchant.bankName || 'Commercial Bank'}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Account Name:</span>
                  <div style={{ fontWeight: 600 }}>{selectedMerchant.accountName || selectedMerchant.shopName}</div>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Account No:</span>
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                    {selectedMerchant.accountNo || '8839201920'}
                  </div>
                </div>
              </div>
            </div>

            {/* Approval & Status Action Controls */}
            <div className="flex items-center justify-between" style={{ marginTop: 10 }}>
              <div>
                <StatusBadge status={selectedMerchant.status} type="merchant" />
              </div>
              <div className="flex items-center gap-3">
                {selectedMerchant.status === 'PENDING_APPROVAL' ? (
                  <>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleVerifyAction(selectedMerchant, false)}
                      disabled={actionLoading}
                    >
                      <XCircle size={14} /> Reject Application
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleVerifyAction(selectedMerchant, true)}
                      disabled={actionLoading}
                    >
                      <CheckCircle size={16} /> Approve & Activate
                    </button>
                  </>
                ) : selectedMerchant.status === 'ACTIVE' ? (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleStatusChange(selectedMerchant, 'SUSPENDED')}
                    disabled={actionLoading}
                  >
                    <ShieldAlert size={14} /> Suspend Outlet
                  </button>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStatusChange(selectedMerchant, 'ACTIVE')}
                    disabled={actionLoading}
                  >
                    <CheckCircle size={14} /> Re-activate Outlet
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
