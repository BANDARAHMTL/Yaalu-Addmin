import React, { useState } from 'react';
import {
  UserPlus,
  Eye,
  Edit2,
  Trash2,
  Shield,
  Store,
  Bike,
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Building,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { Role, UserAccount, UserStatus } from '../types';

interface UsersProps {
  users: UserAccount[];
  onCreateUser: (data: Partial<UserAccount>) => Promise<UserAccount>;
  onUpdateUser: (id: string, data: Partial<UserAccount>) => Promise<UserAccount>;
  onDeleteUser: (id: string) => Promise<boolean>;
  searchTerm: string;
}

export const Users: React.FC<UsersProps> = ({
  users,
  onCreateUser,
  onUpdateUser,
  onDeleteUser,
  searchTerm,
}) => {
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');
  const [status, setStatus] = useState<UserStatus>('ACTIVE');

  // Role-specific form fields
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [shopName, setShopName] = useState('');
  const [businessType, setBusinessType] = useState('Supermarket & Grocery');
  const [registrationNo, setRegistrationNo] = useState('');
  const [vehicleType, setVehicleType] = useState('MOTORBIKE');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');

  const openCreateModal = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setRole('CUSTOMER');
    setStatus('ACTIVE');
    setDeliveryAddress('');
    setShopName('');
    setBusinessType('Supermarket & Grocery');
    setRegistrationNo('');
    setVehicleType('MOTORBIKE');
    setVehicleNumber('');
    setLicenseNumber('');
    setIsCreateOpen(true);
  };

  const openEditModal = (u: UserAccount) => {
    setEditingUser(u);
    setFullName(u.fullName);
    setEmail(u.email);
    setPhone(u.phone || '');
    setRole(u.role);
    setStatus(u.status);
    setDeliveryAddress(u.customerProfile?.deliveryAddress || '');
    setShopName(u.shopProfile?.shopName || '');
    setBusinessType(u.shopProfile?.businessType || 'Supermarket & Grocery');
    setRegistrationNo(u.shopProfile?.registrationNo || '');
    setVehicleType(u.riderProfile?.vehicleType || 'MOTORBIKE');
    setVehicleNumber(u.riderProfile?.vehicleNumber || '');
    setLicenseNumber(u.riderProfile?.licenseNumber || '');
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;

    try {
      setIsSubmitting(true);
      const payload: Partial<UserAccount> = {
        fullName,
        email,
        phone,
        role,
        status,
      };

      if (role === 'CUSTOMER') {
        payload.customerProfile = { deliveryAddress, city: 'Colombo', totalOrders: 0 };
      } else if (role === 'SHOP') {
        payload.shopProfile = { shopName: shopName || fullName, businessType, registrationNo, isVerified: status === 'ACTIVE' };
      } else if (role === 'RIDER') {
        payload.riderProfile = { vehicleType, vehicleNumber, licenseNumber, isApproved: status === 'ACTIVE' };
      }

      await onCreateUser(payload);
      setIsCreateOpen(false);
    } catch (err: any) {
      alert(`❌ Create failed: ${err?.message || 'Backend server not running. Please start the backend first.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setIsSubmitting(true);
      const payload: Partial<UserAccount> = {
        fullName,
        email,
        phone,
        role,
        status,
      };

      if (role === 'CUSTOMER') {
        payload.customerProfile = { ...editingUser.customerProfile, deliveryAddress };
      } else if (role === 'SHOP') {
        payload.shopProfile = { ...editingUser.shopProfile, shopName, businessType, registrationNo };
      } else if (role === 'RIDER') {
        payload.riderProfile = { ...editingUser.riderProfile, vehicleType, vehicleNumber, licenseNumber, isApproved: status === 'ACTIVE' };
      }

      await onUpdateUser(editingUser.id, payload);
      setEditingUser(null);
    } catch (err: any) {
      alert(`❌ Update failed: ${err?.message || 'Backend server not running. Please start the backend first.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone && u.phone.includes(term)) ||
      (u.shopProfile?.shopName && u.shopProfile.shopName.toLowerCase().includes(term));
    return matchesRole && matchesStatus && matchesSearch;
  });

  const getRoleIcon = (userRole: Role) => {
    switch (userRole) {
      case 'ADMIN':
        return <Shield size={14} color="#EF4444" />;
      case 'SHOP':
        return <Store size={14} color="var(--color-primary)" />;
      case 'RIDER':
        return <Bike size={14} color="#8B5CF6" />;
      default:
        return <User size={14} color="#3B82F6" />;
    }
  };

  const getRoleBadgeStyle = (userRole: Role) => {
    switch (userRole) {
      case 'ADMIN':
        return { bg: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' };
      case 'SHOP':
        return { bg: 'rgba(245, 199, 72, 0.15)', color: '#F5C748' };
      case 'RIDER':
        return { bg: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' };
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header & Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            User Accounts & Role Permissions
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Manage and filter system users, customers, shop owners, riders, and administrators
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <UserPlus size={16} /> Create New User
        </button>
      </div>

      {/* Role & Status Filter Strips */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        {/* Role Filter Tabs */}
        <div className="flex items-center gap-2">
          {(['ALL', 'CUSTOMER', 'SHOP', 'RIDER', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="btn btn-sm"
              style={{
                background: roleFilter === r ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                color: roleFilter === r ? '#0F172A' : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {r === 'ALL' ? 'All Roles' : r}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Status:</span>
          {(['ALL', 'ACTIVE', 'PENDING', 'SUSPENDED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn btn-sm"
              style={{
                background: statusFilter === st ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: statusFilter === st ? '#FFFFFF' : 'var(--text-muted)',
                padding: '4px 10px',
                fontSize: 12,
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>User Details</th>
              <th>System Role</th>
              <th>Contact Phone</th>
              <th>Role-Specific Association</th>
              <th>Account Status</th>
              <th>Created Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No users found matching your filters.
                </td>
              </tr>
            ) : (
              filteredUsers.map((u) => {
                const roleBadge = getRoleBadgeStyle(u.role);
                return (
                  <tr key={u.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatarUrl ||
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
                          }
                          alt={u.fullName}
                          style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                            {u.fullName}
                          </div>
                          <div className="flex items-center gap-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                            <Mail size={11} /> {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 5,
                          padding: '3px 9px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: roleBadge.bg,
                          color: roleBadge.color,
                        }}
                      >
                        {getRoleIcon(u.role)}
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1" style={{ fontSize: 13, fontWeight: 600 }}>
                        <Phone size={12} color="var(--text-muted)" /> {u.phone || 'N/A'}
                      </div>
                    </td>
                    <td>
                      {u.role === 'SHOP' && u.shopProfile && (
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-primary)', fontSize: 13 }}>
                            {u.shopProfile.shopName}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {u.shopProfile.businessType}
                          </div>
                        </div>
                      )}
                      {u.role === 'RIDER' && u.riderProfile && (
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>
                            {u.riderProfile.vehicleNumber}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                            {u.riderProfile.vehicleType}
                          </div>
                        </div>
                      )}
                      {u.role === 'CUSTOMER' && (
                        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {u.customerProfile?.deliveryAddress || 'Direct App Customer'}
                        </div>
                      )}
                      {u.role === 'ADMIN' && (
                        <span style={{ fontSize: 12, color: '#EF4444', fontWeight: 600 }}>
                          Full System Authority
                        </span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={u.status} type="general" />
                    </td>
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => setViewingUser(u)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => openEditModal(u)}
                          title="Edit User"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => {
                            if (confirm(`Delete account for ${u.fullName} (${u.email})?`)) {
                              onDeleteUser(u.id);
                            }
                          }}
                          title="Delete User"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* View User Details Modal */}
      {viewingUser && (
        <Modal
          isOpen={!!viewingUser}
          onClose={() => setViewingUser(null)}
          title={`User Profile: ${viewingUser.fullName}`}
          maxWidth={580}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="flex items-center gap-4 card" style={{ padding: 16 }}>
              <img
                src={viewingUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                alt={viewingUser.fullName}
                style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary)' }}
              />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                  {viewingUser.fullName}
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{viewingUser.email}</div>
                <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
                  <span
                    style={{
                      ...getRoleBadgeStyle(viewingUser.role),
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    {viewingUser.role}
                  </span>
                  <StatusBadge status={viewingUser.status} type="general" />
                </div>
              </div>
            </div>

            {/* Role Specific Details Card */}
            {viewingUser.role === 'SHOP' && viewingUser.shopProfile && (
              <div className="card" style={{ padding: 16 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, marginBottom: 12, color: 'var(--color-primary)' }}>
                  <Store size={18} /> Shop Outlet Profile
                </div>
                <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Shop Name:</span>
                    <div style={{ fontWeight: 600 }}>{viewingUser.shopProfile.shopName}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Category:</span>
                    <div style={{ fontWeight: 600 }}>{viewingUser.shopProfile.businessType}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>BR Number:</span>
                    <div style={{ fontWeight: 600 }}>{viewingUser.shopProfile.registrationNo || 'N/A'}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Outlet Address:</span>
                    <div style={{ fontWeight: 600 }}>{viewingUser.shopProfile.shopAddress || 'On file'}</div>
                  </div>
                </div>
              </div>
            )}

            {viewingUser.role === 'RIDER' && viewingUser.riderProfile && (
              <div className="card" style={{ padding: 16 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, marginBottom: 12, color: '#8B5CF6' }}>
                  <Bike size={18} /> Rider Vehicle & License
                </div>
                <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Vehicle No:</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      {viewingUser.riderProfile.vehicleNumber}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Vehicle Type:</span>
                    <div style={{ fontWeight: 600 }}>{viewingUser.riderProfile.vehicleType}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>License No:</span>
                    <div style={{ fontWeight: 600 }}>{viewingUser.riderProfile.licenseNumber}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Approval:</span>
                    <div style={{ fontWeight: 700, color: 'var(--color-success)' }}>
                      {viewingUser.riderProfile.isApproved ? 'Approved & Authorized' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewingUser.role === 'CUSTOMER' && (
              <div className="card" style={{ padding: 16 }}>
                <div className="flex items-center gap-2" style={{ fontWeight: 700, marginBottom: 8, color: '#3B82F6' }}>
                  <MapPin size={16} /> Delivery Location
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  {viewingUser.customerProfile?.deliveryAddress || 'Colombo Delivery Zone'}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button className="btn btn-secondary btn-sm" onClick={() => setViewingUser(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit User Modal */}
      {(isCreateOpen || editingUser) && (
        <Modal
          isOpen={isCreateOpen || !!editingUser}
          onClose={() => {
            setIsCreateOpen(false);
            setEditingUser(null);
          }}
          title={editingUser ? `Edit User: ${editingUser.fullName}` : 'Create New User Account'}
          maxWidth={600}
        >
          <form
            onSubmit={editingUser ? handleEditSubmit : handleCreateSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Kasun Bandara"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="user@yaalu.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Mobile Phone</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="+94 77 XXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">Assign Role</label>
                <select
                  className="select-field"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="CUSTOMER">CUSTOMER</option>
                  <option value="SHOP">SHOP (Merchant)</option>
                  <option value="RIDER">RIDER (Delivery)</option>
                  <option value="ADMIN">ADMIN (Super Access)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Account Status</label>
                <select
                  className="select-field"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as UserStatus)}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING REVIEW</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>
              </div>
            </div>

            {/* Dynamic Role Fields */}
            {role === 'CUSTOMER' && (
              <div className="input-group">
                <label className="input-label">Delivery Address</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="No. 12, Galle Road, Colombo"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>
            )}

            {role === 'SHOP' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 10, border: '1px solid var(--border-dark)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 10 }}>
                  Shop & Business Details:
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="input-group">
                    <label className="input-label">Shop Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. City Supermart"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Business Registration (BR)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="PV-XXXXX"
                      value={registrationNo}
                      onChange={(e) => setRegistrationNo(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {role === 'RIDER' && (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: 14, borderRadius: 10, border: '1px solid var(--border-dark)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#8B5CF6', marginBottom: 10 }}>
                  Rider Vehicle & License Info:
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="input-group">
                    <label className="input-label">Vehicle Type</label>
                    <select
                      className="select-field"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="MOTORBIKE">Motorbike</option>
                      <option value="SCOOTER">Scooter</option>
                      <option value="THREE_WHEEL">Three Wheel</option>
                      <option value="CAR">Car</option>
                      <option value="VAN">Van</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Vehicle No</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="WP BCD-1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">License No</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="B-XXXXXXX"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingUser(null);
                }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User Account'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
