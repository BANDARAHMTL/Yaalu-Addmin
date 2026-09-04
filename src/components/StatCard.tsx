import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: any;
  iconBg?: string;
  iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconBg = 'rgba(245, 199, 72, 0.15)',
  iconColor = '#F5C748',
}) => {
  return (
    <div className="card card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
          {title}
        </span>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color={iconColor} />
        </div>
      </div>

      <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      {change && (
        <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              color: isPositive ? 'var(--color-success)' : 'var(--color-danger)',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {isPositive ? '↑ +' : '↓ -'}{change}
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>vs last month</span>
        </div>
      )}
    </div>
  );
};
