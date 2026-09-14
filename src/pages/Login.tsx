import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  KeyRound,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { UserAccount } from '../types';

interface LoginProps {
  onLoginSuccess: (user: UserAccount) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@yaalu.lk');
  const [password, setPassword] = useState('Admin@yaalu123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your administrator email');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await adminApi.adminLogin(email.trim(), password);
      onLoginSuccess(data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to authenticate administrator');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail('admin@yaalu.lk');
    setPassword('Admin@yaalu123');
    setErrorMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F8FAFC',
        backgroundImage:
          'radial-gradient(at 10% 20%, rgba(255, 199, 44, 0.25) 0px, transparent 50%), radial-gradient(at 90% 80%, rgba(254, 240, 138, 0.3) 0px, transparent 50%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Rings */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: '1px solid rgba(255, 199, 44, 0.15)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          border: '1px solid rgba(255, 199, 44, 0.1)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 460,
          backgroundColor: '#FFFFFF',
          backdropFilter: 'blur(20px)',
          border: '1px solid #E2E8F0',
          borderRadius: 24,
          padding: '40px 36px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              overflow: 'hidden',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 25px rgba(255, 199, 44, 0.4)',
              marginBottom: 16,
            }}
          >
            <img src="/logo.png" alt="Yaalu Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: '#000000',
              letterSpacing: '-0.02em',
              marginBottom: 6,
            }}
          >
            Yaalu<span style={{ color: '#991B1B' }}>Admin</span>
          </h1>
          <p style={{ fontSize: 13.5, color: '#1E3A8A', fontWeight: 700 }}>
            Super Administrator Secure Access Console
          </p>
        </div>

        {/* Security Policy Notice - Registration Disabled */}
        <div
          style={{
            backgroundColor: '#FEE2E2',
            border: '1px solid #FCA5A5',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            marginBottom: 24,
          }}
        >
          <ShieldAlert size={18} color="#991B1B" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 12, color: '#991B1B', fontWeight: 700, lineHeight: 1.5 }}>
            <strong>Registration Restricted:</strong> Self-registration is strictly disabled for administrator security. Only pre-authorized administrative credentials can sign in.
          </div>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 12,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
              color: '#F87171',
              fontSize: 13,
            }}
          >
            <AlertCircle size={16} color="#F87171" style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: 'block',
                fontSize: 12.5,
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: 8,
              }}
            >
              Administrator Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={17}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yaalu.lk"
                className="input-field"
                style={{
                  paddingLeft: 42,
                  paddingRight: 14,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 14,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <label
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                }}
              >
                Password
              </label>
              <span
                style={{
                  fontSize: 11.5,
                  color: 'var(--text-muted)',
                }}
              >
                Encrypted with bcrypt
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <Lock
                size={17}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input-field"
                style={{
                  paddingLeft: 42,
                  paddingRight: 42,
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: 14,
                  borderRadius: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 4,
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '13px 20px',
              fontSize: 14,
              fontWeight: 700,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 8px 20px rgba(245, 199, 72, 0.25)',
            }}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Console</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Quick-Fill Card */}
        <div
          style={{
            marginTop: 28,
            padding: 16,
            backgroundColor: '#FFFBEB',
            border: '1px dashed #FDE047',
            borderRadius: 14,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              <KeyRound size={14} />
              <span>Default Super Admin Credentials</span>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              style={{
                background: 'rgba(245, 199, 72, 0.15)',
                border: '1px solid rgba(245, 199, 72, 0.3)',
                color: 'var(--color-primary)',
                padding: '2px 8px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Autofill
            </button>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <div>
              <strong>Email:</strong> <code>admin@yaalu.lk</code>
            </div>
            <div>
              <strong>Password:</strong> <code>Admin@yaalu123</code>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              * Role is verified against PostgreSQL database.
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            fontSize: 11.5,
            color: 'var(--text-muted)',
          }}
        >
          <span className="flex items-center gap-1">
            <CheckCircle2 size={13} color="var(--color-success)" />
            PostgreSQL Verified
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={13} color="var(--color-success)" />
            Role-Based Guard
          </span>
        </div>
      </div>
    </div>
  );
};
