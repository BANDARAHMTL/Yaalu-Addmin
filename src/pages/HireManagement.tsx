import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Clock,
  DollarSign,
  Hash,
  User,
  Bike,
  Trash2,
  Plus,
  X,
  RefreshCw,
  Search,
} from 'lucide-react';
import { formatRiderId, formatCustomerId } from '../utils/formatId';
import { adminApi } from '../services/api';
import { Modal } from '../components/Modal';

interface Hire {
  id: string;
  riderId: string;
  riderName: string;
  customerId: string;
  customerName: string;
  distanceKm: number;
  durationMinutes: number;
  fee: number;
  vehicleType: string;
  vehicleNumber: string;
  createdAt: string;
}

interface HireManagementProps {
  hires: Hire[];
  searchTerm: string;
  onRefresh: () => Promise<void>;
}

const VEHICLE_ICONS: Record<string, React.ReactNode> = {
  THREE_WHEEL: <Car size={14} color="var(--color-primary)" />,
  CAR: <Car size={14} color="#60A5FA" />,
  VAN: <Car size={14} color="#A78BFA" />,
  BIKE: <Bike size={14} color="#34D399" />,
};

const VEHICLE_LABELS: Record<string, string> = {
  THREE_WHEEL: 'Three-Wheeler',
  CAR: 'Car',
  VAN: 'Van',
  BIKE: 'Bike / Motorcycle',
};

const emptyForm = {
  riderId: '',
  riderName: '',
  customerId: '',
  customerName: '',
  distanceKm: '',
  durationMinutes: '',
  fee: '',
  vehicleType: 'THREE_WHEEL',
  vehicleNumber: '',
};

export const HireManagement: React.FC<HireManagementProps> = ({
  hires,
  searchTerm,
  onRefresh,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedHire, setSelectedHire] = useState<Hire | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filtered = hires.filter((h) => {
    const q = searchTerm.toLowerCase();
    return (
      h.riderName.toLowerCase().includes(q) ||
      h.customerName.toLowerCase().includes(q) ||
      h.vehicleNumber.toLowerCase().includes(q) ||
      h.vehicleType.toLowerCase().includes(q)
    );
  });

  const handleSave = async () => {
    if (!form.riderId || !form.riderName || !form.customerId || !form.customerName || !form.vehicleNumber) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      setSaving(true);
      await adminApi.createHire({
        riderId: form.riderId,
        riderName: form.riderName,
        customerId: form.customerId,
        customerName: form.customerName,
        distanceKm: parseFloat(form.distanceKm) || 0,
        durationMinutes: parseInt(form.durationMinutes) || 0,
        fee: parseFloat(form.fee) || 0,
        vehicleType: form.vehicleType,
        vehicleNumber: form.vehicleNumber,
      });
      setShowAddModal(false);
      setForm(emptyForm);
      await onRefresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this hire record?')) return;
    try {
      setDeleting(id);
      await adminApi.deleteHire(id);
      await onRefresh();
    } finally {
      setDeleting(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  const formField = (label: string, key: keyof typeof emptyForm, type = 'text', placeholder = '') => (
    <div>
      <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 5, fontWeight: 600 }}>{label}</div>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8,
          padding: '8px 12px',
          color: 'var(--text-primary)',
          fontSize: 13,
          boxSizing: 'border-box',
        }}
      />
    </div>
  );

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filtered.length} hire record{filtered.length !== 1 ? 's' : ''} found
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <RefreshCw size={13} className={refreshing ? 'spin' : ''} />
            Refresh
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setForm(emptyForm); setShowAddModal(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Plus size={14} /> Add Hire Record
          </button>
        </div>
      </div>

      {/* Hire Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Hire Details</th>
              <th>Rider</th>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Distance</th>
              <th>Duration</th>
              <th>Fee (LKR)</th>
              <th>Date & Time</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 50, color: 'var(--text-muted)' }}>
                  <Car size={32} style={{ opacity: 0.3, marginBottom: 10, display: 'block', margin: '0 auto 10px' }} />
                  No hire records found.
                </td>
              </tr>
            ) : (
              filtered.map((h) => (
                <tr key={h.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedHire(h)}>
                  {/* Hire ID */}
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 13 }}>
                      #HIRE-{formatRiderId(h.id)}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'monospace' }}>
                      {h.id.slice(0, 8)}...
                    </div>
                  </td>

                  {/* Rider */}
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {h.riderName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      <Hash size={10} style={{ display: 'inline', marginRight: 2 }} />
                      R-{formatRiderId(h.riderId)}
                    </div>
                  </td>

                  {/* Customer */}
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                      {h.customerName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                      <Hash size={10} style={{ display: 'inline', marginRight: 2 }} />
                      C-{formatCustomerId(h.customerId)}
                    </div>
                  </td>

                  {/* Vehicle */}
                  <td>
                    <div className="flex items-center gap-2">
                      {VEHICLE_ICONS[h.vehicleType] || <Car size={14} />}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{h.vehicleNumber}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {VEHICLE_LABELS[h.vehicleType] || h.vehicleType}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Distance */}
                  <td>
                    <div className="flex items-center gap-1" style={{ fontWeight: 700, fontSize: 14 }}>
                      <MapPin size={13} color="var(--color-primary)" />
                      {h.distanceKm.toFixed(1)} km
                    </div>
                  </td>

                  {/* Duration */}
                  <td>
                    <div className="flex items-center gap-1" style={{ fontWeight: 600, fontSize: 13 }}>
                      <Clock size={13} color="#60A5FA" />
                      {h.durationMinutes} min
                    </div>
                  </td>

                  {/* Fee */}
                  <td>
                    <div style={{ fontWeight: 800, fontSize: 14, color: '#10B981' }}>
                      Rs. {h.fee.toLocaleString('en-LK', { minimumFractionDigits: 2 })}
                    </div>
                  </td>

                  {/* Date */}
                  <td>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {new Date(h.createdAt).toLocaleDateString('en-LK', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {new Date(h.createdAt).toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-sm"
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      onClick={() => handleDelete(h.id)}
                      disabled={deleting === h.id}
                    >
                      <Trash2 size={13} />
                      {deleting === h.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Hire Modal */}
      {showAddModal && (
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Hire Record" maxWidth={580}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="grid grid-cols-2 gap-4">
              {formField('Rider ID *', 'riderId', 'text', 'e.g. uuid or short id')}
              {formField('Rider Name *', 'riderName', 'text', 'Full name of the rider')}
              {formField('Customer ID *', 'customerId', 'text', 'e.g. uuid or short id')}
              {formField('Customer Name *', 'customerName', 'text', 'Full name of the customer')}
              {formField('Distance (km)', 'distanceKm', 'number', 'e.g. 5.2')}
              {formField('Duration (minutes)', 'durationMinutes', 'number', 'e.g. 18')}
              {formField('Hire Fee (LKR)', 'fee', 'number', 'e.g. 450.00')}
              {formField('Vehicle Number *', 'vehicleNumber', 'text', 'e.g. WP CAB-1234')}
            </div>

            {/* Vehicle Type */}
            <div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>Vehicle Type</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(VEHICLE_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setForm((f) => ({ ...f, vehicleType: val }))}
                    className="btn btn-sm"
                    style={{
                      background: form.vehicleType === val ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: form.vehicleType === val ? '#0F172A' : 'var(--text-primary)',
                      fontWeight: 700,
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {VEHICLE_ICONS[val]} {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end" style={{ gap: 8, marginTop: 4 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> {saving ? 'Saving...' : 'Save Hire Record'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Hire Detail Modal */}
      {selectedHire && (
        <Modal isOpen={!!selectedHire} onClose={() => setSelectedHire(null)} title={`Hire Details — #HIRE-${formatRiderId(selectedHire.id)}`} maxWidth={520}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* ID Section */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Rider ID</div>
                <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 15 }}>R-{formatRiderId(selectedHire.riderId)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{selectedHire.riderName}</div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Customer ID</div>
                <div style={{ fontWeight: 700, color: '#60A5FA', fontSize: 15 }}>C-{formatCustomerId(selectedHire.customerId)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{selectedHire.customerName}</div>
              </div>
            </div>

            {/* Trip Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card" style={{ padding: 14, textAlign: 'center' }}>
                <MapPin size={18} color="var(--color-primary)" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedHire.distanceKm.toFixed(1)}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>km Distance</div>
              </div>
              <div className="card" style={{ padding: 14, textAlign: 'center' }}>
                <Clock size={18} color="#60A5FA" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{selectedHire.durationMinutes}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>min Duration</div>
              </div>
              <div className="card" style={{ padding: 14, textAlign: 'center' }}>
                <DollarSign size={18} color="#10B981" style={{ margin: '0 auto 6px' }} />
                <div style={{ fontSize: 18, fontWeight: 800, color: '#10B981' }}>
                  {selectedHire.fee.toLocaleString('en-LK')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LKR Fee</div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Vehicle</div>
              <div className="flex items-center gap-2">
                {VEHICLE_ICONS[selectedHire.vehicleType] || <Car size={16} />}
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{selectedHire.vehicleNumber}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{VEHICLE_LABELS[selectedHire.vehicleType] || selectedHire.vehicleType}</div>
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div className="card" style={{ padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Hire Date & Time</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
                {new Date(selectedHire.createdAt).toLocaleString('en-LK', {
                  weekday: 'short', year: 'numeric', month: 'short', day: '2-digit',
                  hour: '2-digit', minute: '2-digit', second: '2-digit',
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                className="btn btn-sm"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#F87171', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                onClick={() => { handleDelete(selectedHire.id); setSelectedHire(null); }}
              >
                <Trash2 size={13} /> Delete Record
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedHire(null)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
