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
  Calculator,
  Percent,
  Timer,
  LogOut,
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'users'
  | 'payments'
  | 'merchants'
  | 'riders'
  | 'fare_engine'
  | 'commission_mgmt'
  | 'bid_mgmt'
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
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount = 0,
  pendingPaymentsCount = 0,
  onLogout,
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
    { id: 'fare_engine', label: 'Fare Pricing Engine', icon: Calculator },
    { id: 'commission_mgmt', label: 'Commission Management', icon: Percent },
    { id: 'bid_mgmt', label: 'Bid Management', icon: Timer },
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
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0,
        boxShadow: '2px 0 10px rgba(0, 0, 0, 0.02)',
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
              backgroundColor: '#FFC72C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(255, 199, 44, 0.4)',
            }}
          >
            <ShieldCheck size={26} color="#0B1044" />
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#000000', letterSpacing: '-0.01em' }}>
              Yaalu<span style={{ color: '#991B1B' }}>Admin</span>
            </div>
            <div style={{ fontSize: 11, color: '#1E3A8A', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                  background: isActive ? '#FFC72C' : 'transparent',
                  color: isActive ? '#000000' : '#0B1044',
                  fontWeight: isActive ? 800 : 700,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  boxShadow: isActive ? '0 4px 12px rgba(255, 199, 44, 0.35)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#FFFBEB';
                    e.currentTarget.style.color = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#0B1044';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Icon size={18} color={isActive ? '#000000' : '#1E3A8A'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    style={{
                      background: isActive ? '#000000' : item.badgeColor || '#991B1B',
                      color: '#FFFFFF',
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
          background: '#FFFBEB',
          border: '1px solid #FEF08A',
          borderRadius: 14,
          padding: 14,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#991B1B', fontWeight: 800 }}>Backend API</span>
          <span className="badge badge-success" style={{ padding: '2px 8px', fontSize: 11 }}>
            Online
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#0B1044', fontWeight: 600 }}>
          Connected to port 3001
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5"
            style={{
              fontSize: 11.5,
              color: '#1E3A8A',
              textDecoration: 'none',
              fontWeight: 800,
            }}
          >
            <span>API Docs</span>
            <ExternalLink size={12} />
          </a>

          {onLogout && (
            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#991B1B',
                fontSize: 11.5,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 6px',
                borderRadius: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEE2E2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={12} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
