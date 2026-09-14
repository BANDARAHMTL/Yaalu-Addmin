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
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.02)',
      }}
    >
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#000000', letterSpacing: '-0.01em' }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: '#1E3A8A', marginTop: 2, fontWeight: 700 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Global Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search
            size={16}
            color="#1E3A8A"
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
              backgroundColor: '#F8FAFC',
              borderColor: '#E2E8F0',
              color: '#000000',
              fontWeight: 600,
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
            <RefreshCw size={16} color="#0B1044" className={isRefreshing ? 'spin' : ''} />
          </button>
        )}

        {/* Notification Bell */}
        <button className="btn btn-secondary btn-icon" style={{ position: 'relative' }}>
          <Bell size={17} color="#0B1044" />
          <span
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#991B1B',
              border: '2px solid #FFFFFF',
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
              backgroundColor: '#FFFBEB',
              border: '1px solid #FEF08A',
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
                  border: '2px solid #FFC72C',
                }}
              />
            ) : (
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: '#FFC72C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UserCheck size={16} color="#0B1044" />
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#000000' }}>
                {currentUser?.fullName || 'Super Admin'}
              </div>
              <div style={{ fontSize: 11, color: '#991B1B', fontWeight: 800 }}>
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
                fontWeight: 800,
                color: '#991B1B',
                borderColor: '#FCA5A5',
                backgroundColor: '#FEE2E2',
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
