import React, { useState } from 'react';
import { Eye, Clock, CheckCircle, PackageCheck, Truck, XCircle, MapPin, Phone, User } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import { formatOrderId } from '../utils/formatId';

interface OrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<Order>;
  searchTerm: string;
}

export const Orders: React.FC<OrdersProps> = ({ orders, onUpdateOrderStatus, searchTerm }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      setLoading(true);
      const updated = await onUpdateOrderStatus(orderId, status);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesFilter = statusFilter === 'all' || o.status === statusFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      (o.customerName && o.customerName.toLowerCase().includes(term)) ||
      (o.merchantName && o.merchantName.toLowerCase().includes(term));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Filters Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          {(['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className="btn btn-sm"
              style={{
                background: statusFilter === st ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                color: statusFilter === st ? '#0F172A' : 'var(--text-secondary)',
                fontWeight: 700,
                textTransform: 'capitalize',
              }}
            >
              {st}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filteredOrders.length} orders listed
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Merchant Outlet</th>
              <th>Items & Total</th>
              <th>Assigned Rider</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                    #{formatOrderId(o.id)}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700 }}>{o.customerName || 'Customer'}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                      {o.customerPhone || 'N/A'}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>
                    {o.merchantName || 'Central Store'}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#FFFFFF' }}>
                      LKR {o.totalAmount.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                      {o.items?.length || 1} item{o.items?.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td>
                    {o.riderName ? (
                      <span style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                        {o.riderName}
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Unassigned</span>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={o.status} type="order" />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedOrder(o)}
                    >
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details & Status Workflow Modal */}
      {selectedOrder && (
        <Modal
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`Order #${formatOrderId(selectedOrder.id)} Overview`}
          maxWidth={620}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Header info */}
            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </span>
                <StatusBadge status={selectedOrder.status} type="order" />
              </div>

              <div className="grid grid-cols-2 gap-4" style={{ fontSize: 13 }}>
                <div>
                  <div className="flex items-center gap-2" style={{ fontWeight: 600 }}>
                    <User size={14} color="var(--color-primary)" /> {selectedOrder.customerName}
                  </div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    <Phone size={12} /> {selectedOrder.customerPhone || 'Direct'}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    <MapPin size={14} color="var(--color-primary)" />
                    {selectedOrder.deliveryAddress || 'Standard Delivery Address'}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div style={{ border: '1px solid var(--border-dark)', borderRadius: 12, overflow: 'hidden' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{it.productName}</td>
                      <td>x{it.quantity}</td>
                      <td>LKR {it.unitPrice}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>
                        LKR {it.subtotal.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} style={{ fontWeight: 800, textAlign: 'right' }}>
                      Grand Total:
                    </td>
                    <td style={{ fontWeight: 800, textAlign: 'right', color: 'var(--color-primary)', fontSize: 16 }}>
                      LKR {selectedOrder.totalAmount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Status Advance Workflow */}
            <div className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>
                Update Order Delivery Stage:
              </div>
              <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedOrder.id, st)}
                    disabled={loading}
                    className="btn btn-sm"
                    style={{
                      background: selectedOrder.status === st ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: selectedOrder.status === st ? '#0F172A' : 'var(--text-primary)',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
