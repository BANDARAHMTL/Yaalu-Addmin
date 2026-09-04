import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'rider' | 'merchant' | 'invoice' | 'general';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'general' }) => {
  const normalized = status.toUpperCase();

  let badgeClass = 'badge-info';
  let label = status;

  if (type === 'order') {
    switch (status.toLowerCase()) {
      case 'delivered':
        badgeClass = 'badge-success';
        label = 'Delivered';
        break;
      case 'processing':
      case 'shipped':
        badgeClass = 'badge-info';
        label = status.charAt(0).toUpperCase() + status.slice(1);
        break;
      case 'confirmed':
        badgeClass = 'badge-purple';
        label = 'Confirmed';
        break;
      case 'pending':
        badgeClass = 'badge-warning';
        label = 'Pending';
        break;
      case 'cancelled':
        badgeClass = 'badge-danger';
        label = 'Cancelled';
        break;
    }
  } else if (type === 'rider') {
    switch (normalized) {
      case 'AVAILABLE':
        badgeClass = 'badge-success';
        label = 'Available';
        break;
      case 'BUSY':
        badgeClass = 'badge-purple';
        label = 'On Delivery';
        break;
      case 'OFFLINE':
        badgeClass = 'badge-warning';
        label = 'Offline';
        break;
      case 'SUSPENDED':
      case 'PENDING':
        badgeClass = 'badge-danger';
        label = normalized === 'PENDING' ? 'Pending Approval' : 'Suspended';
        break;
    }
  } else if (type === 'merchant') {
    switch (normalized) {
      case 'ACTIVE':
        badgeClass = 'badge-success';
        label = 'Active & Verified';
        break;
      case 'PENDING_APPROVAL':
        badgeClass = 'badge-warning';
        label = 'Pending Review';
        break;
      case 'SUSPENDED':
        badgeClass = 'badge-danger';
        label = 'Suspended';
        break;
    }
  } else if (type === 'invoice') {
    switch (normalized) {
      case 'PAID':
        badgeClass = 'badge-success';
        label = 'Paid';
        break;
      case 'PENDING':
        badgeClass = 'badge-warning';
        label = 'Payment Pending';
        break;
    }
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: 'currentColor',
        }}
      />
      {label}
    </span>
  );
};
