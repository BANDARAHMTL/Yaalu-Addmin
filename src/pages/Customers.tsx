import React from 'react';
import { User, Phone, Mail, MapPin, ShoppingBag } from 'lucide-react';
import { Customer } from '../types';

interface CustomersProps {
  customers: Customer[];
  searchTerm: string;
}

export const Customers: React.FC<CustomersProps> = ({ customers, searchTerm }) => {
  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(term) ||
      (c.mobile && c.mobile.includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          Registered Customers
        </h2>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
          Directory of active Yaalu shoppers and order statistics
        </p>
      </div>

      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Delivery Address</th>
              <th>Orders Placed</th>
              <th>Total Platform Spend</th>
              <th>Registered Since</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No customer profiles found.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: '50%',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#3B82F6',
                          fontWeight: 700,
                        }}
                      >
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{c.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                          ID: {c.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontSize: 12.5, fontWeight: 600 }}>
                      <Phone size={12} color="var(--text-muted)" /> {c.mobile || 'N/A'}
                    </div>
                    {c.email && (
                      <div className="flex items-center gap-1" style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                        <Mail size={12} /> {c.email}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1" style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                      <MapPin size={13} color="var(--color-primary)" /> {c.address || 'Colombo, Sri Lanka'}
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-1" style={{ fontWeight: 700 }}>
                      <ShoppingBag size={14} color="var(--color-primary)" /> {c.totalOrders || 1} orders
                    </span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--color-success)' }}>
                    LKR {(c.totalSpent || 4500).toLocaleString()}
                  </td>
                  <td>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
