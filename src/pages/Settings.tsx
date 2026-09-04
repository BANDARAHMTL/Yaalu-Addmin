import React, { useState } from 'react';
import { Cloud, CheckCircle2, ShieldCheck, Database, Server, UploadCloud, Copy, Check } from 'lucide-react';
import { CLOUDINARY_CONFIG, uploadToCloudinary } from '../services/cloudinary';

export const Settings: React.FC = () => {
  const [testImage, setTestImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTestUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file, 'yaalu_admin_test');
      setTestImage(url);
    } catch (err: any) {
      alert(`Test upload failed: ${err?.message || 'Error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const copyUrl = () => {
    if (testImage) {
      navigator.clipboard.writeText(testImage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
          System & Storage Configuration
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Cloudinary CDN, backend connections, and cloud storage diagnostics
        </p>
      </div>

      {/* Cloudinary Integration Card */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Cloud size={24} color="#3B82F6" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
                Cloudinary Cloud Storage
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Active Cloud Name: <strong style={{ color: 'var(--color-primary)' }}>{CLOUDINARY_CONFIG.cloudName}</strong>
              </div>
            </div>
          </div>
          <span className="badge badge-success">Configured & Active</span>
        </div>

        <div className="grid grid-cols-2 gap-3" style={{ fontSize: 13 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Upload Preset:</span>
            <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{CLOUDINARY_CONFIG.uploadPreset}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 12, borderRadius: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>API Key:</span>
            <div style={{ fontWeight: 700 }}>{CLOUDINARY_CONFIG.apiKey}</div>
          </div>
        </div>

        {/* Live Upload Test Box */}
        <div
          style={{
            border: '1px dashed var(--border-dark)',
            borderRadius: 12,
            padding: 18,
            backgroundColor: 'rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
            Live Cloudinary Upload Diagnostic Test:
          </div>
          <label className="btn btn-secondary btn-sm" style={{ cursor: isUploading ? 'not-allowed' : 'pointer' }}>
            <UploadCloud size={16} />
            {isUploading ? 'Uploading to yaalu cloud...' : 'Pick & Test Upload Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleTestUpload}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
          </label>

          {testImage && (
            <div
              style={{
                width: '100%',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={testImage}
                  alt="Uploaded"
                  style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#10B981' }}>
                    Uploaded Successfully to Cloudinary!
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {testImage}
                  </div>
                </div>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={copyUrl}>
                {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy URL'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Backend & Architecture Overview */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="flex items-center gap-3">
          <Server size={22} color="var(--color-primary)" />
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
            Backend Infrastructure
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4" style={{ fontSize: 13 }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 10 }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 600, marginBottom: 4 }}>
              <Database size={15} color="#10B981" /> PostgreSQL Database
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              Prisma ORM schema with User, ShopProfile, RiderProfile, Product, Order, Invoice models.
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: 14, borderRadius: 10 }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 600, marginBottom: 4 }}>
              <ShieldCheck size={15} color="var(--color-primary)" /> Microservice / Monolith Mode
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
              NestJS API Gateway operating on port 3001 connecting mobile app and admin operations.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
