import React, { useState } from 'react';
import { Bike, CheckCircle2, Phone, Star, ShieldCheck, Car, Truck, Landmark, Save, Edit3 } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Rider } from '../types';

interface RidersProps {
  riders: Rider[];
  onApprove: (id: string, isApproved: boolean) => Promise<void>;
  onUpdateStatus: (id: string, status: Rider['status']) => Promise<void>;
  onUpdateBankDetails: (id: string, data: any) => Promise<void>;
  searchTerm: string;
}

export const Riders: React.FC<RidersProps> = ({
  riders,
  onApprove,
  onUpdateStatus,
  onUpdateBankDetails,
  searchTerm,
}) => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'BUSY' | 'PENDING' | 'OFFLINE'>('ALL');
  const [loading, setLoading] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: '', accountName: '', accountNo: '', accountBranch: '',
  });

  const filteredRiders = riders.filter((r) => {
    const matchesFilter =
      filter === 'ALL' ||
      (filter === 'PENDING' ? !r.isApproved || r.status === 'PENDING' : r.status === filter);
    const matchesSearch =
      (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || '').includes(searchTerm) ||
      (r.vehicleNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleApproveAction = async (rider: Rider, approve: boolean) => {
    try {
      setLoading(true);
      await onApprove(rider.id, approve);
      setSelectedRider(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (rider: Rider, status: Rider['status']) => {
    try {
      setLoading(true);
      await onUpdateStatus(rider.id, status);
      if (selectedRider?.id === rider.id) {
        setSelectedRider({ ...selectedRider, status });
      }
    } finally {
      setLoading(false);
    }
  };

  const openBankEdit = (r: Rider) => {
    setBankForm({
      bankName: r.bankName || '',
      accountName: r.accountName || '',
      accountNo: r.accountNo || '',
      accountBranch: r.accountBranch || '',
    });
    setEditingBank(true);
  };

  const handleSaveBank = async () => {
    if (!selectedRider) return;
    try {
      setBankSaving(true);
      await onUpdateBankDetails(selectedRider.id, bankForm);
      setSelectedRider({ ...selectedRider, ...bankForm });
      setEditingBank(false);
    } finally {
      setBankSaving(false);
    }
  };

  const renderVehicleIcon = (type: Rider['vehicleType']) => {
    switch (type) {
      case 'THREE_WHEEL':
      case 'CAR':
        return <Car size={16} color="var(--color-primary)" />;
      case 'VAN':
        return <Truck size={16} color="var(--color-primary)" />;
      default:
        return <Bike size={16} color="var(--color-primary)" />;
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(['ALL', 'AVAILABLE', 'BUSY', 'PENDING', 'OFFLINE'] as const).map((tab) => (
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
              {tab === 'ALL'
                ? 'All Riders'
                : tab === 'PENDING'
                ? 'Pending Approval'
                : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filteredRiders.length} registered riders
        </div>
      </div>

      {/* Riders Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Rider Name</th>
              <th>Contact Phone</th>
              <th>Vehicle & Type</th>
              <th>License Number</th>
              <th>Rating & Trips</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRiders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No delivery riders found matching your filters.
                </td>
              </tr>
            ) : (
              filteredRiders.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {r.profilePhotoUrl ? (
                        <img
                          src={r.profilePhotoUrl}
                          alt={r.fullName}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid var(--color-primary)',
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: '50%',
                            backgroundColor: 'rgba(245, 199, 72, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            color: 'var(--color-primary)',
                          }}
                        >
                          {r.fullName ? r.fullName.charAt(0) : 'R'}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {r.fullName}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                          ID: {r.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontWeight: 600 }}>
                      <Phone size={13} color="var(--text-muted)" /> {r.phone || 'No phone'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {renderVehicleIcon(r.vehicleType)}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{r.vehicleNumber || 'Pending Reg'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          {r.vehicleModel || r.vehicleType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: 12, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>
                      {r.licenseNumber || 'Pending'}
                    </code>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontWeight: 700, color: '#F59E0B' }}>
                      <Star size={13} fill="#F59E0B" /> {r.rating || '5.0'}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {r.deliveriesCompleted || 0} deliveries completed
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={r.status} type="rider" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedRider(r)}
                      >
                        Details
                      </button>
                      {!r.isApproved && (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleApproveAction(r, true)}
                          disabled={loading}
                        >
                          <CheckCircle2 size={14} /> Approve
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

      {/* Rider Modal */}
      {selectedRider && (
        <Modal
          isOpen={!!selectedRider}
          onClose={() => setSelectedRider(null)}
          title={`Rider Verification: ${selectedRider.fullName}`}
          maxWidth={600}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Rider Header Card */}
            <div className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
              {selectedRider.profilePhotoUrl ? (
                <img
                  src={selectedRider.profilePhotoUrl}
                  alt={selectedRider.fullName}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--color-primary)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(245, 199, 72, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 22,
                    color: 'var(--color-primary)',
                  }}
                >
                  {selectedRider.fullName ? selectedRider.fullName.charAt(0) : 'R'}
                </div>
              )}
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {selectedRider.fullName}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>
                  📞 {selectedRider.phone} {selectedRider.nicNumber ? `| NIC: ${selectedRider.nicNumber}` : ''}
                </div>
                {selectedRider.city && (
                  <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>
                    📍 {selectedRider.address ? `${selectedRider.address}, ` : ''}{selectedRider.city}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Vehicle Reg No</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>
                  {selectedRider.vehicleNumber || 'Not provided'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {selectedRider.vehicleModel || selectedRider.vehicleType}
                </div>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Driving License</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF', marginTop: 2 }}>
                  {selectedRider.licenseNumber || 'Not provided'}
                </div>
                <div style={{ fontSize: 12, color: selectedRider.licenseExpiry ? 'var(--color-success)' : 'var(--text-muted)' }}>
                  {selectedRider.licenseExpiry ? `Expires: ${selectedRider.licenseExpiry}` : 'National Driving Document'}
                </div>
              </div>
            </div>

            {/* License Photos Preview */}
            {(selectedRider.licenseFrontUrl || selectedRider.licenseBackUrl) && (
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                  Uploaded License Documents:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {selectedRider.licenseFrontUrl && (
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Front Photo</div>
                      <a href={selectedRider.licenseFrontUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={selectedRider.licenseFrontUrl}
                          alt="License Front"
                          style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </a>
                    </div>
                  )}
                  {selectedRider.licenseBackUrl && (
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Back Photo</div>
                      <a href={selectedRider.licenseBackUrl} target="_blank" rel="noopener noreferrer">
                        <img
                          src={selectedRider.licenseBackUrl}
                          alt="License Back"
                          style={{ width: '100%', height: 110, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 13 }}>
                  <Landmark size={16} color="var(--color-primary)" /> Payout Bank Account
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => editingBank ? setEditingBank(false) : openBankEdit(selectedRider)}
                  style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Edit3 size={13} /> {editingBank ? 'Cancel' : 'Edit'}
                </button>
              </div>
              {editingBank ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { label: 'Bank Name', key: 'bankName', placeholder: 'e.g. BOC' },
                      { label: 'Account Name', key: 'accountName', placeholder: 'Full name on account' },
                      { label: 'Account Number', key: 'accountNo', placeholder: 'e.g. 0012345678' },
                      { label: 'Branch', key: 'accountBranch', placeholder: 'e.g. Kandy' },
                    ] as const).map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
                        <input
                          style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 10px', color: 'var(--text-primary)', fontSize: 13 }}
                          value={bankForm[key]}
                          onChange={e => setBankForm(f => ({ ...f, [key]: e.target.value }))}
                          placeholder={placeholder}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSaveBank}
                    disabled={bankSaving}
                    style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Save size={14} /> {bankSaving ? 'Saving...' : 'Save Bank Details'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
                  {[['Bank', selectedRider.bankName], ['Account Name', selectedRider.accountName],
                    ['Account No', selectedRider.accountNo], ['Branch', selectedRider.accountBranch]].map(([label, val]) => (
                    <div key={label as string}>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{label}</div>
                      <div style={{ fontWeight: 600, color: val ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: val ? 13 : 12 }}>
                        {val || 'Not set'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                Update Operational Status:
              </div>
              <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                {(['AVAILABLE', 'BUSY', 'OFFLINE', 'SUSPENDED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusToggle(selectedRider, st)}
                    className="btn btn-sm"
                    style={{
                      background: selectedRider.status === st ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: selectedRider.status === st ? '#0F172A' : 'var(--text-primary)',
                      fontWeight: 700,
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
              <StatusBadge status={selectedRider.status} type="rider" />
              {!selectedRider.isApproved ? (
                <button
                  className="btn btn-primary"
                  onClick={() => handleApproveAction(selectedRider, true)}
                  disabled={loading}
                >
                  <ShieldCheck size={16} /> Approve & Authorize
                </button>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedRider(null)}
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
