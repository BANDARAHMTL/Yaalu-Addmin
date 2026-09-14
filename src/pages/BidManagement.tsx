import React, { useState, useEffect } from 'react';
import {
  Timer,
  Gavel,
  Save,
  RotateCcw,
  CheckCircle2,
  Clock,
  Car,
  Bike,
  Truck,
  Zap,
  Sliders,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { FareSetting } from '../types';

interface BidManagementProps {
  onNotify?: (msg: string) => void;
}

export const BidManagement: React.FC<BidManagementProps> = ({ onNotify }) => {
  const [settings, setSettings] = useState<FareSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingVehicle, setSavingVehicle] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [demoTimer, setDemoTimer] = useState<number>(120);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(true);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('THREE_WHEEL');

  useEffect(() => {
    loadBidSettings();
  }, []);

  // Demo countdown effect
  useEffect(() => {
    let interval: any;
    if (isDemoRunning) {
      interval = setInterval(() => {
        setDemoTimer((prev) => (prev > 0 ? prev - 1 : 120));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isDemoRunning]);

  const loadBidSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getFareSettings();
      if (Array.isArray(data) && data.length > 0) {
        setSettings(data);
      }
    } catch (err) {
      console.warn('Failed to load bid settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeoutChange = (vehicleType: string, newMins: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.vehicleType === vehicleType ? { ...s, bidTimeoutMinutes: newMins } : s))
    );
  };

  const handleSaveTimeout = async (setting: FareSetting) => {
    try {
      setSavingVehicle(setting.vehicleType);
      const updated = await adminApi.updateFareSettings({
        ...setting,
        bidTimeoutMinutes: parseFloat(String(setting.bidTimeoutMinutes)) > 0 ? parseFloat(String(setting.bidTimeoutMinutes)) : 2.0,
      });
      setSettings((prev) => prev.map((s) => (s.vehicleType === updated.vehicleType ? updated : s)));
      setSavedSuccess(setting.vehicleType);
      if (onNotify) onNotify(`Bid timeout for ${setting.vehicleName} updated to ${setting.bidTimeoutMinutes} minutes!`);
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err: any) {
      alert(`Failed to update bid timeout: ${err.message || err}`);
    } finally {
      setSavingVehicle(null);
    }
  };

  const currentSetting = settings.find((s) => s.vehicleType === selectedVehicle) || settings[0];
  const activeMins = currentSetting ? (Number(currentSetting.bidTimeoutMinutes) || 2.0) : 2.0;
  const activeSecs = Math.round(activeMins * 60);

  const vehicleIcons: Record<string, any> = {
    THREE_WHEEL: Car,
    MOTORBIKE: Bike,
    CAR: Car,
    VAN: Truck,
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Timer size={20} color="#60A5FA" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                Rider Bid & Dispatch Management
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                Configure bidding countdown timeout limits, auto-decline durations, and ride dispatch rules.
              </p>
            </div>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadBidSettings}>
          <RotateCcw size={14} /> Refresh Timeouts
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: '#0B1044', fontSize: 12, fontWeight: 700 }}>
            <span>Three Wheel Bidding Window</span>
            <Compass size={16} color="#0B1044" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#000000', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'THREE_WHEEL')?.bidTimeoutMinutes ?? 2.0} Min
          </div>
          <div style={{ fontSize: 11, color: '#1E3A8A', marginTop: 4, fontWeight: 600 }}>
            {Math.round((settings.find((s) => s.vehicleType === 'THREE_WHEEL')?.bidTimeoutMinutes ?? 2.0) * 60)}s countdown
          </div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: '#0B1044', fontSize: 12, fontWeight: 700 }}>
            <span>Bike Delivery Window</span>
            <Bike size={16} color="#0B1044" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#000000', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'MOTORBIKE')?.bidTimeoutMinutes ?? 2.0} Min
          </div>
          <div style={{ fontSize: 11, color: '#1E3A8A', marginTop: 4, fontWeight: 600 }}>Fast dispatch limit</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: '#0B1044', fontSize: 12, fontWeight: 700 }}>
            <span>Car / Taxi Window</span>
            <Car size={16} color="#0B1044" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#000000', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'CAR')?.bidTimeoutMinutes ?? 3.0} Min
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>City passenger rides</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Van / Cargo Window</span>
            <Truck size={16} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#8B5CF6', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'VAN')?.bidTimeoutMinutes ?? 5.0} Min
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Heavy logistics buffer</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Editable Timeouts Table */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 15, color: '#FFF' }}>
              <Clock size={18} color="#60A5FA" /> Vehicle Bidding Time Windows
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Timer limit before request auto-declines</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {settings.map((setting) => {
              const Icon = vehicleIcons[setting.vehicleType] || Car;
              const isSaving = savingVehicle === setting.vehicleType;
              const isSaved = savedSuccess === setting.vehicleType;
              const mins = Number(setting.bidTimeoutMinutes) || 2.0;
              const secs = Math.round(mins * 60);

              return (
                <div
                  key={setting.vehicleType}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: 'rgba(59, 130, 246, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={20} color="#60A5FA" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#FFF' }}>
                          {setting.vehicleName}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                          Bidding Window: <strong>{mins} minutes ({secs}s)</strong>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={isSaving}
                      onClick={() => handleSaveTimeout(setting)}
                      style={{ minWidth: 100 }}
                    >
                      {isSaving ? (
                        'Saving...'
                      ) : isSaved ? (
                        <>
                          <CheckCircle2 size={13} /> Saved!
                        </>
                      ) : (
                        <>
                          <Save size={13} /> Update
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4" style={{ alignItems: 'center' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Bid Window Duration (Minutes):
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          step="any"
                          min="0.25"
                          max="30"
                          value={setting.bidTimeoutMinutes !== undefined ? setting.bidTimeoutMinutes : ''}
                          onChange={(e) =>
                            handleTimeoutChange(setting.vehicleType, e.target.value)
                          }
                          placeholder="2.0"
                          style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: '#60A5FA',
                            fontSize: 15,
                            fontWeight: 800,
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 9,
                            fontSize: 11,
                            color: 'var(--text-muted)',
                          }}
                        >
                          Mins
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(59, 130, 246, 0.08)',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      }}
                    >
                      <div style={{ fontSize: 11, color: '#60A5FA', fontWeight: 700 }}>
                        ⏱️ Total Countdown Time
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 900, color: '#60A5FA', marginTop: 2 }}>
                        {secs} <span style={{ fontSize: 11, fontWeight: 600 }}>Seconds per Request</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live In-App Rider Bidding Simulator */}
        <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: 20,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: 14, color: '#60A5FA' }}>
                <Zap size={18} /> Live Rider Bidding Screen Preview
              </div>
              <span className="badge badge-info">App Mockup</span>
            </div>

            {/* Vehicle Selector */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                Previewing Vehicle:
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {settings.map((s) => (
                  <button
                    key={s.vehicleType}
                    onClick={() => {
                      setSelectedVehicle(s.vehicleType);
                      const m = Number(s.bidTimeoutMinutes) || 2.0;
                      setDemoTimer(Math.round(m * 60));
                    }}
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      borderRadius: 8,
                      border: 'none',
                      background: selectedVehicle === s.vehicleType ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                      color: selectedVehicle === s.vehicleType ? '#FFF' : 'var(--text-secondary)',
                      fontWeight: selectedVehicle === s.vehicleType ? 800 : 600,
                      fontSize: 11,
                      cursor: 'pointer',
                    }}
                  >
                    {s.vehicleType === 'THREE_WHEEL'
                      ? 'Tuk Tuk'
                      : s.vehicleType === 'MOTORBIKE'
                      ? 'Bike'
                      : s.vehicleType === 'CAR'
                      ? 'Car'
                      : 'Van'}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Card Preview Simulation */}
            <div
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                color: '#0F172A',
                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  style={{
                    background: '#FEF3C7',
                    padding: '3px 8px',
                    borderRadius: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Zap size={11} color="#D97706" />
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: '#92400E' }}>
                    New Hire Request
                  </span>
                </div>

                {/* Countdown Badge */}
                <div
                  style={{
                    background: demoTimer <= 15 ? '#FEE2E2' : '#EFF6FF',
                    padding: '4px 8px',
                    borderRadius: 6,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Clock size={12} color={demoTimer <= 15 ? '#DC2626' : '#2563EB'} />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 900,
                      fontFamily: 'monospace',
                      color: demoTimer <= 15 ? '#DC2626' : '#2563EB',
                    }}
                  >
                    {formatTimer(demoTimer)}
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                  Colombo City Center
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#94A3B8', margin: '2px 0' }}>
                  TO
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A' }}>
                  Negombo Beach Road (36 km)
                </div>
              </div>

              <div
                style={{
                  background: '#F8FAFC',
                  padding: 10,
                  borderRadius: 10,
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 9.5, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Starting Price
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#D97706' }}>Rs. 1,000</div>
                </div>
                <div style={{ width: 1, background: '#E2E8F0' }} />
                <div>
                  <div style={{ fontSize: 9.5, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>
                    Bid Range
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0F172A' }}>Rs. 900 - 1,250</div>
                </div>
              </div>

              <div
                style={{
                  background: '#FFC72C',
                  padding: '10px 14px',
                  borderRadius: 10,
                  textAlign: 'center',
                  fontWeight: 800,
                  fontSize: 13,
                  color: '#0F172A',
                }}
              >
                Place Rider Bid
              </div>
            </div>

            {/* Simulation Controls */}
            <div className="flex items-center justify-between" style={{ marginTop: 14, fontSize: 12 }}>
              <span style={{ color: 'var(--text-muted)' }}>Simulation state:</span>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setDemoTimer(activeSecs);
                  setIsDemoRunning(true);
                }}
              >
                <RotateCcw size={12} /> Restart Countdown ({activeSecs}s)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
