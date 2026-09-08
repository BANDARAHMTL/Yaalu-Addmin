import React from 'react';
import { Users, ShoppingCart, Store, Bike, AlertCircle, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Merchant, Order, Product, Rider, SystemStats } from '../types';

interface DashboardProps {
  stats: SystemStats;
  orders: Order[];
  merchants: Merchant[];
  riders: Rider[];
  products: Product[];
  onNavigate: (tab: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  orders,
  merchants,
  riders,
  products,
  onNavigate,
}) => {
  const pendingMerchants = merchants.filter((m) => m.status === 'PENDING_APPROVAL');
  const activeRidersList = riders.filter((r) => r.status === 'AVAILABLE' || r.status === 'BUSY');

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Verification Alert Banner */}
      {stats.pendingApprovals > 0 && (
        <div
          style={{
            background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 14,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
              }}
            >
              <AlertCircle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: 14.5 }}>
                {stats.pendingApprovals} Verification Request{stats.pendingApprovals > 1 ? 's' : ''} Pending Review
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                New merchant shops and delivery riders require your manual verification.
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onNavigate(pendingMerchants.length > 0 ? 'merchants' : 'riders')}
          >
            Review Now
          </button>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Users"
          value={stats.totalUsers}
          change="All Roles"
          isPositive={true}
          icon={Users}
          iconBg="rgba(16, 185, 129, 0.15)"
          iconColor="#10B981"
        />
        <StatCard
          title="Total Orders Processed"
          value={stats.totalOrders}
          change="12.1%"
          isPositive={true}
          icon={ShoppingCart}
          iconBg="rgba(59, 130, 246, 0.15)"
          iconColor="#3B82F6"
        />
        <StatCard
          title="Registered Merchants"
          value={merchants.length}
          change="4 new"
          isPositive={true}
          icon={Store}
          iconBg="rgba(245, 199, 72, 0.15)"
          iconColor="#F5C748"
        />
        <StatCard
          title="Active Riders Online"
          value={`${activeRidersList.length} / ${riders.length}`}
          icon={Bike}
          iconBg="rgba(139, 92, 246, 0.15)"
          iconColor="#8B5CF6"
        />
      </div>

      {/* Main Insights Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Recent Orders Overview */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>
                Recent Platform Orders
              </h2>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
                Live feed of purchases across all registered merchants
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate('orders')}>
              View All Orders <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Merchant Shop</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                      #{order.id}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {order.customerPhone || 'Direct App'}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {order.merchantName || 'General Store'}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      LKR {order.totalAmount.toLocaleString()}
                    </td>
                    <td>
                      <StatusBadge status={order.status} type="order" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operations & Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Top Selling Merchants Card */}
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              Top Partner Outlets
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {merchants.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={m.logoUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                      alt={m.shopName}
                      style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {m.shopName}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        {m.totalProducts || products.length} products listed
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>
                      LKR {(m.revenue || 250000).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick System Status Card */}
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              System Health & Cloud
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="#10B981" /> Cloudinary CDN
                </span>
                <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>cloud: yaalu</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <span className="flex items-center gap-2">
                  <CheckCircle2 size={16} color="#10B981" /> PostgreSQL Database
                </span>
                <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Connected</span>
              </div>
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <span className="flex items-center gap-2">
                  <Clock size={16} color="#3B82F6" /> Realtime Gateway
                </span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Port 3001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
