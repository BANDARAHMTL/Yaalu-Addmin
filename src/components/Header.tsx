import React from 'react';
import { Search, Bell, RefreshCw, UserCheck, LogOut } from 'lucide-react';
import { UserAccount } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  searchTerm,
  setSearchTerm,
  onRefresh,
  isRefreshing = false,
  currentUser,
  onLogout,
}) => {
  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 32px',
        backgroundColor: 'var(--bg-sidebar)',
        borderBottom: '1px solid var(--border-dark)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Global Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={16}
            color="var(--text-muted)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search items, shops, orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{
              paddingLeft: 36,
              paddingTop: 8,
              paddingBottom: 8,
              fontSize: 13,
              borderRadius: 10,
            }}
          />
        </div>

        {/* Refresh Action */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="btn btn-secondary btn-icon"
            title="Refresh Data"
            disabled={isRefreshing}
          >
            <RefreshCw size={16} className={isRefreshing ? 'spin' : ''} />
          </button>
        )}

        {/* Notification Bell */}
        <button className="btn btn-secondary btn-icon" style={{ position: 'relative' }}>
          <Bell size={17} />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
            }}
          />
        </button>

        {/* Super Admin Profile Chip & Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 14px',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-dark)',
              borderRadius: 12,
            }}
          >
            {currentUser?.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt="Admin Avatar"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '1px solid rgba(245, 199, 72, 0.5)',
                }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  border: '1px solid rgba(245, 199, 72, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UserCheck size={16} color="var(--color-primary)" />
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser?.fullName || 'Super Admin'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600 }}>
                {currentUser?.email || 'admin@yaalu.lk'}
              </div>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="btn btn-secondary"
              title="Sign Out of Admin Console"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 12px',
                fontSize: 12.5,
                fontWeight: 600,
                color: '#F87171',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                backgroundColor: 'rgba(239, 68, 68, 0.05)',
              }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
