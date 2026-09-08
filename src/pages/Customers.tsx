import React, { useState } from 'react';
import { User, Phone, Mail, MapPin, ShoppingBag, CreditCard, Save, Edit3, X, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Customer } from '../types';
import { Modal } from '../components/Modal';

interface CustomersProps {
  customers: Customer[];
  onUpdateCustomer?: (id: string, data: Partial<Customer>) => Promise<void>;
  onUpdateCardDetails?: (id: string, data: any) => Promise<void>;
  searchTerm: string;
}

export const Customers: React.FC<CustomersProps> = ({
  customers,
  searchTerm,
  onUpdateCustomer,
  onUpdateCardDetails,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    notes: '',
    cardLast4: '',
    cardType: '',
    billingAddress: '',
  });

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.mobile && c.mobile.includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term)) ||
      (c.city && c.city.toLowerCase().includes(term))
    );
  });

  const openDetails = (c: Customer) => {
    setSelectedCustomer(c);
  };

  const openEdit = (c: Customer) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name || '',
      email: c.email || '',
      mobile: c.mobile || '',
      address: c.address || '',
      city: c.city || '',
      notes: c.notes || '',
      cardLast4: c.cardLast4 || '',
      cardType: c.cardType || '',
      billingAddress: c.billingAddress || '',
    });
    setErrorMessage('');
    setSaveSuccess(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    if (!formData.name.trim()) {
      setErrorMessage('Customer name is required');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');

      const payload: Partial<Customer> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        notes: formData.notes.trim(),
        cardLast4: formData.cardLast4.trim(),
        cardType: formData.cardType,
        billingAddress: formData.billingAddress.trim(),
      };

      if (onUpdateCustomer) {
        await onUpdateCustomer(editingCustomer.id, payload);
      } else if (onUpdateCardDetails) {
        await onUpdateCardDetails(editingCustomer.id, payload);
      }

      // Update selected customer if open
      if (selectedCustomer && selectedCustomer.id === editingCustomer.id) {
        setSelectedCustomer({ ...selectedCustomer, ...payload });
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setEditingCustomer(null);
        setSaveSuccess(false);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to update customer details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Registered Customers
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Directory of active Yaalu shoppers, profiles, and billing details
          </p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
          Total Customers: <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{customers.length}</span>
        </div>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Delivery Location</th>
              <th>Payment Card</th>
              <th>Registered Since</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No customer profiles found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#3B82F6',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {c.name ? c.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.name || 'Unnamed Customer'}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>ID: {c.id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      <Phone size={12} color="var(--text-muted)" /> {c.mobile || 'N/A'}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        <Mail size={12} /> {c.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      <MapPin size={13} color="var(--color-primary)" /> {c.city ? `${c.city} - ` : ''}{c.address || 'Sri Lanka'}
                    </div>
                  </td>
                  <td>
                    {c.cardLast4 ? (
                      <span className="badge" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5 }}>
                        <CreditCard size={12} /> {c.cardType || 'CARD'} •••• {c.cardLast4}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No card linked</span>
                    )}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openDetails(c)}
                      >
                        Details
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => openEdit(c)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Customer Details Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer: ${selectedCustomer.name}`}
          maxWidth={520}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Full Name</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedCustomer.name || '—'}</div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Email Address</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedCustomer.email || '—'}</div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Phone Number</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedCustomer.mobile || '—'}</div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>City</div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedCustomer.city || '—'}</div>
              </div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Delivery Address</div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{selectedCustomer.address || '—'}</div>
            </div>

            {selectedCustomer.notes && (
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3 }}>Notes</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{selectedCustomer.notes}</div>
              </div>
            )}

            {/* Card Payment Details */}
            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700 }}>
                  <CreditCard size={16} color="var(--color-primary)" /> Card Payment Details
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Card</div>
                  <div style={{ fontWeight: 600 }}>
                    {selectedCustomer.cardType && selectedCustomer.cardLast4
                      ? `${selectedCustomer.cardType} •••• ${selectedCustomer.cardLast4}`
                      : <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not configured</span>}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Billing Address</div>
                  <div style={{ fontWeight: 600 }}>{selectedCustomer.billingAddress || <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Not set</span>}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedCustomer(null)}
              >
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const cust = selectedCustomer;
                  setSelectedCustomer(null);
                  openEdit(cust);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Edit3 size={14} /> Edit Customer
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Customer Modal */}
      {editingCustomer && (
        <Modal
          isOpen={!!editingCustomer}
          onClose={() => !isSaving && setEditingCustomer(null)}
          title={`Edit Customer: ${editingCustomer.name}`}
          maxWidth={560}
        >
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {errorMessage && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#EF4444', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={15} /> {errorMessage}
              </div>
            )}

            {saveSuccess && (
              <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', fontSize: 12.5, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={15} /> Changes saved successfully!
              </div>
            )}

            {/* Profile Section */}
            <div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <User size={15} color="var(--color-primary)" /> Basic Profile Information
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Full Name *</label>
                  <input
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Kasun Sagara"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Phone Number</label>
                  <input
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="e.g. 0112121145"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Email Address</label>
                  <input
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. kasun.sagara@gmail.com"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>City / Region</label>
                  <input
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Kottawa"
                  />
                </div>
              </div>
            </div>

            {/* Address & Notes */}
            <div>
              <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Delivery Address</label>
              <input
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g. No. 12, Highlevel Road, Kottawa"
              />
            </div>

            <div>
              <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Notes / Instructions</label>
              <textarea
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13, minHeight: 60, resize: 'vertical' }}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Leave package at gate / Call upon arrival"
              />
            </div>

            {/* Card Payment Section */}
            <div style={{ paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CreditCard size={15} color="var(--color-primary)" /> Card Payment Details
              </h4>
              <div className="grid grid-cols-2 gap-3" style={{ marginBottom: 10 }}>
                <div>
                  <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Card Last 4 Digits</label>
                  <input
                    style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                    value={formData.cardLast4}
                    maxLength={4}
                    onChange={(e) => setFormData({ ...formData, cardLast4: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 8899"
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Card Type</label>
                  <select
                    style={{ width: '100%', background: 'rgba(30,41,59,1)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                    value={formData.cardType}
                    onChange={(e) => setFormData({ ...formData, cardType: e.target.value })}
                  >
                    <option value="">None / Not set</option>
                    <option value="VISA">VISA</option>
                    <option value="MASTERCARD">MASTERCARD</option>
                    <option value="AMEX">AMEX</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>Billing Address</label>
                <input
                  style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: 13 }}
                  value={formData.billingAddress}
                  onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
                  placeholder="e.g. No. 12, Highlevel Road, Kottawa, Sri Lanka"
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingCustomer(null)}
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
                <Save size={15} /> {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
