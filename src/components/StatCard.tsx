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
  iconBg = '#FFFBEB',
  iconColor = '#991B1B',
}) => {
  return (
    <div className="card card-interactive" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="flex items-center justify-between" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 13.5, color: '#0B1044', fontWeight: 800 }}>
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

      <div style={{ fontSize: 28, fontWeight: 800, color: '#000000', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      {change && (
        <div className="flex items-center gap-2" style={{ marginTop: 10 }}>
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 800,
              color: isPositive ? '#0B1044' : '#991B1B',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            {isPositive ? '↑ +' : '↓ -'}{change}
          </span>
          <span style={{ fontSize: 12, color: '#1E3A8A', fontWeight: 600 }}>vs last month</span>
        </div>
      )}
    </div>
  );
};
