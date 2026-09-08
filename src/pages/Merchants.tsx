import React, { useState } from 'react';
import { Store, CheckCircle, XCircle, Eye, ShieldAlert, Phone, Mail, MapPin, Building, CreditCard, Landmark, Save, Edit3, UploadCloud, Image as ImageIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Merchant } from '../types';
import { uploadToCloudinary } from '../services/cloudinary';

interface MerchantsProps {
  merchants: Merchant[];
  onVerify: (id: string, isVerified: boolean) => Promise<void>;
  onUpdateStatus: (id: string, status: Merchant['status']) => Promise<void>;
  onUpdateMerchant?: (id: string, data: Partial<Merchant>) => Promise<Merchant>;
  onUpdateBankDetails: (id: string, data: any) => Promise<void>;
  searchTerm: string;
}

export const Merchants: React.FC<MerchantsProps> = ({
  merchants,
  onVerify,
  onUpdateStatus,
  onUpdateMerchant,
  onUpdateBankDetails,
  searchTerm,
}) => {
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'>('ALL');
  const [actionLoading, setActionLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '', accountName: '', accountNo: '', accountBranch: '',
    cardLast4: '', cardType: '',
  });

  // Edit merchant form state
  const [merchantForm, setMerchantForm] = useState({
    shopName: '',
    ownerName: '',
    ownerPhone: '',
    ownerEmail: '',
    businessType: '',
    shopAddress: '',
    registrationNo: '',
    logoUrl: '',
    bannerUrl: '',
  });

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

  const openBankEdit = (m: Merchant) => {
    setBankForm({
      bankName: m.bankName || '',
      accountName: m.accountName || '',
      accountNo: m.accountNo || '',
      accountBranch: m.accountBranch || '',
      cardLast4: m.cardLast4 || '',
      cardType: m.cardType || '',
    });
    setEditingBank(true);
  };

  const handleSaveBank = async () => {
    if (!selectedMerchant) return;
    try {
      setBankSaving(true);
      await onUpdateBankDetails(selectedMerchant.id, bankForm);
      setSelectedMerchant({ ...selectedMerchant, ...bankForm });
      setEditingBank(false);
    } finally {
      setBankSaving(false);
    }
  };

  const openEditMerchant = (m: Merchant) => {
    setEditingMerchant(m);
    setMerchantForm({
      shopName: m.shopName || '',
      ownerName: m.ownerName || '',
      ownerPhone: m.ownerPhone || '',
      ownerEmail: m.ownerEmail || '',
      businessType: m.businessType || 'Supermarket & Grocery',
      shopAddress: m.shopAddress || '',
      registrationNo: m.registrationNo || '',
      logoUrl: m.logoUrl || '',
      bannerUrl: m.bannerUrl || '',
    });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingLogo(true);
      const url = await uploadToCloudinary(file, 'yaalu/merchants');
      setMerchantForm((prev) => ({ ...prev, logoUrl: url }));
    } catch (err: any) {
      console.warn('Logo upload error:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveMerchant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchant || !onUpdateMerchant) return;
    try {
      setIsSaving(true);
      const updated = await onUpdateMerchant(editingMerchant.id, merchantForm);
      if (selectedMerchant?.id === editingMerchant.id) {
        setSelectedMerchant({ ...selectedMerchant, ...updated });
      }
      setEditingMerchant(null);
    } catch (err: any) {
      alert(`Update failed: ${err?.message || 'Error'}`);
    } finally {
      setIsSaving(false);
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
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openEditMerchant(m)}
                        title="Edit Shop Profile & Logo"
                      >
                        <Edit3 size={13} /> Edit
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

      {/* Edit Merchant Modal */}
      {editingMerchant && (
        <Modal
          isOpen={!!editingMerchant}
          onClose={() => !isSaving && setEditingMerchant(null)}
          title={`Edit Merchant: ${editingMerchant.shopName}`}
          maxWidth={580}
        >
          <form onSubmit={handleSaveMerchant} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Logo Image Upload & URL */}
            <div className="input-group">
              <label className="input-label" style={{ fontWeight: 600 }}>Shop Logo Image</label>
              <div className="flex items-start gap-4">
                {merchantForm.logoUrl ? (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <img
                      src={merchantForm.logoUrl}
                      alt="Logo Preview"
                      style={{ width: 72, height: 72, borderRadius: 12, objectFit: 'cover', border: '2px solid var(--color-primary)' }}
                    />
                    <button
                      type="button"
                      onClick={() => setMerchantForm((f) => ({ ...f, logoUrl: '' }))}
                      style={{ position: 'absolute', top: -6, right: -6, background: '#EF4444', color: '#FFF', border: 'none', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 11 }}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div style={{ width: 72, height: 72, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px dashed var(--border-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ImageIcon size={22} color="var(--text-muted)" />
                  </div>
                )}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label
                    className="btn btn-secondary btn-sm"
                    style={{ cursor: uploadingLogo ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 }}
                  >
                    <UploadCloud size={14} />
                    {uploadingLogo ? 'Processing logo...' : 'Upload Logo File'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      style={{ display: 'none' }}
                    />
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    style={{ fontSize: 12, padding: '6px 10px' }}
                    placeholder="Or paste Logo URL (https://...)"
                    value={merchantForm.logoUrl}
                    onChange={(e) => setMerchantForm({ ...merchantForm, logoUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label" style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Shop Name *</label>
                <input
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                  value={merchantForm.shopName}
                  onChange={(e) => setMerchantForm({ ...merchantForm, shopName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="input-label" style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Business Category</label>
                <input
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                  value={merchantForm.businessType}
                  onChange={(e) => setMerchantForm({ ...merchantForm, businessType: e.target.value })}
                  placeholder="e.g. Grocery / Electronics / Fashion"
                />
              </div>
              <div>
                <label className="input-label" style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Owner Name</label>
                <input
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                  value={merchantForm.ownerName}
                  onChange={(e) => setMerchantForm({ ...merchantForm, ownerName: e.target.value })}
                />
              </div>
              <div>
                <label className="input-label" style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Owner Phone</label>
                <input
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                  value={merchantForm.ownerPhone}
                  onChange={(e) => setMerchantForm({ ...merchantForm, ownerPhone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="input-label" style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Shop Address</label>
              <input
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                value={merchantForm.shopAddress}
                onChange={(e) => setMerchantForm({ ...merchantForm, shopAddress: e.target.value })}
              />
            </div>

            <div>
              <label className="input-label" style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Business Registration No (BR)</label>
              <input
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                value={merchantForm.registrationNo}
                onChange={(e) => setMerchantForm({ ...merchantForm, registrationNo: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingMerchant(null)}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSaving}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Save size={14} /> {isSaving ? 'Saving...' : 'Save Merchant'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Detailed Merchant View Modal */}
      {selectedMerchant && (
        <Modal
          isOpen={!!selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
          title={`Merchant Profile: ${selectedMerchant.shopName}`}
          maxWidth={680}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Header / Avatar Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 12,
                border: '1px solid var(--border-dark)',
              }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={selectedMerchant.logoUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                  alt={selectedMerchant.shopName}
                  style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {selectedMerchant.shopName}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                    Merchant ID: <code style={{ color: 'var(--color-primary)' }}>{selectedMerchant.id}</code>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedMerchant.status} type="merchant" />
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const m = selectedMerchant;
                    setSelectedMerchant(null);
                    openEditMerchant(m);
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
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
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700 }}>
                  <Landmark size={18} color="var(--color-primary)" /> Banking & Settlement Details
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => editingBank ? setEditingBank(false) : openBankEdit(selectedMerchant)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Edit3 size={13} /> {editingBank ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editingBank ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. Commercial Bank' },
                      { label: 'Account Name', key: 'accountName', placeholder: 'Account holder name' },
                      { label: 'Account Number', key: 'accountNo', placeholder: 'e.g. 1234567890' },
                      { label: 'Branch', key: 'accountBranch', placeholder: 'e.g. Colombo 03' },
                    ] as const).map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                        <input
                          className="form-input"
                          style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 13 }}
                          value={bankForm[key]}
                          onChange={e => setBankForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, marginTop: 2 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                      <CreditCard size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                      Card Details (last 4 digits only)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Card Last 4 Digits</div>
                        <input
                          className="form-input"
                          style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 13 }}
                          value={bankForm.cardLast4}
                          maxLength={4}
                          onChange={e => setBankForm(f => ({ ...f, cardLast4: e.target.value.replace(/\D/g, '') }))}
                          placeholder="e.g. 4242"
                        />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Card Type</div>
                        <select
                          style={{ width: '100%', background: 'rgba(30,41,59,1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 13 }}
                          value={bankForm.cardType}
                          onChange={e => setBankForm(f => ({ ...f, cardType: e.target.value }))}
                        >
                          <option value="">Select type</option>
                          <option value="VISA">VISA</option>
                          <option value="MASTERCARD">MASTERCARD</option>
                          <option value="AMEX">AMEX</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveBank}
                    disabled={bankSaving}
                    style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}
                  >
                    <Save size={14} /> {bankSaving ? 'Saving...' : 'Save Bank Details'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Bank & Branch</div>
                    <div style={{ fontWeight: 600 }}>{selectedMerchant.bankName ? `${selectedMerchant.bankName} (${selectedMerchant.accountBranch || 'Main'})` : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not configured</span>}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Account No</div>
                    <div style={{ fontWeight: 600 }}>{selectedMerchant.accountNo || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not configured</span>}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Account Name</div>
                    <div style={{ fontWeight: 600 }}>{selectedMerchant.accountName || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not configured</span>}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Payment Card</div>
                    <div style={{ fontWeight: 600 }}>
                      {selectedMerchant.cardType && selectedMerchant.cardLast4
                        ? `${selectedMerchant.cardType} •••• ${selectedMerchant.cardLast4}`
                        : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not configured</span>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-dark)', paddingTop: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {selectedMerchant.status !== 'ACTIVE' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleStatusChange(selectedMerchant, 'ACTIVE')}
                    disabled={actionLoading}
                  >
                    <CheckCircle size={14} /> Set Active
                  </button>
                )}
                {selectedMerchant.status !== 'SUSPENDED' && (
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ color: '#EF4444' }}
                    onClick={() => handleStatusChange(selectedMerchant, 'SUSPENDED')}
                    disabled={actionLoading}
                  >
                    <XCircle size={14} /> Suspend Shop
                  </button>
                )}
              </div>
              <button className="btn btn-secondary" onClick={() => setSelectedMerchant(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
