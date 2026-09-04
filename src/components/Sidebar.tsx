import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Store,
  Bike,
  Package,
  ShoppingCart,
  FileText,
  UserCheck,
  Settings,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'users'
  | 'payments'
  | 'merchants'
  | 'riders'
  | 'products'
  | 'orders'
  | 'invoices'
  | 'customers'
  | 'settings';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  pendingCount?: number;
  pendingPaymentsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  pendingPaymentsCount = 0,
}) => {
  const navItems: Array<{ id: TabType; label: string; icon: any; badge?: string; badgeColor?: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Accounts', icon: Users },
    {
      id: 'payments',
      label: 'Payment Verification',
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? `${pendingPaymentsCount}` : undefined,
      badgeColor: '#10B981',
    },
    {
      id: 'merchants',
      label: 'Shops & Merchants',
      icon: Store,
      badge: pendingCount > 0 ? `${pendingCount}` : undefined,
    },
    { id: 'riders', label: 'Delivery Riders', icon: Bike },
    { id: 'products', label: 'Global Products', icon: Package },
    { id: 'orders', label: 'Live Orders', icon: ShoppingCart },
    { id: 'invoices', label: 'Invoices & Billing', icon: FileText },
    { id: 'customers', label: 'Customer Base', icon: UserCheck },
    { id: 'settings', label: 'System & Storage', icon: Settings },
  ];

  return (
    <aside
      style={{
        width: 270,
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-dark)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
      }}
    >
      <div>
        {/* Yaalu Logo Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 12px',
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              backgroundColor: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(245, 199, 72, 0.35)',
            }}
          >
            <ShieldCheck size={26} color="#0F172A" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              Yaalu<span style={{ color: 'var(--color-primary)' }}>Admin</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Operations Portal
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: 'none',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  color: isActive ? '#0F172A' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={18} color={isActive ? '#0F172A' : 'currentColor'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: isActive ? '#0F172A' : item.badgeColor || 'var(--color-warning)',
                      color: isActive ? '#FFFFFF' : '#0F172A',
                      padding: '2px 7px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Status Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-dark)',
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Backend API</span>
          <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: 11 }}>
            Online
          </span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Connected to port 3001
        </div>
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2"
          style={{
            marginTop: 10,
            fontSize: 11.5,
            color: 'var(--color-primary)',
            textDecoration: 'none',
            fontWeight: 600,
          }}
        >
          <span>Open API Gateway</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </aside>
  );
};
