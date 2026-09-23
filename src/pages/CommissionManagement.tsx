import React, { useState, useEffect } from 'react';
import {
  Percent,
  Coins,
  Save,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Car,
  Bike,
  Truck,
  ShieldAlert,
  Wallet,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { FareSetting } from '../types';

interface CommissionManagementProps {
  onNotify?: (msg: string) => void;
}

export const CommissionManagement: React.FC<CommissionManagementProps> = ({ onNotify }) => {
  const [settings, setSettings] = useState<FareSetting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingVehicle, setSavingVehicle] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [simulatedFare, setSimulatedFare] = useState<number>(1000);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('THREE_WHEEL');

  useEffect(() => {
    loadCommissionSettings();
  }, []);

  const loadCommissionSettings = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getFareSettings();
      if (Array.isArray(data) && data.length > 0) {
        setSettings(data);
      } else {
        setSettings([
          { id: '1', vehicleType: 'THREE_WHEEL', vehicleName: 'Three-Wheeler', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 25, otherRunningCostPerKm: 5, fixedCostPerKm: 2, profitMultiplier: 3, baseChargeFirstKm: 150, minimumFare: 150, commissionPercent: 10, isActive: true },
          { id: '2', vehicleType: 'MOTORBIKE', vehicleName: 'Bike / Courier', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 40, otherRunningCostPerKm: 3, fixedCostPerKm: 1, profitMultiplier: 3, baseChargeFirstKm: 100, minimumFare: 100, commissionPercent: 10, isActive: true },
          { id: '3', vehicleType: 'CAR', vehicleName: 'Car / Taxi', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 12, otherRunningCostPerKm: 10, fixedCostPerKm: 5, profitMultiplier: 3, baseChargeFirstKm: 200, minimumFare: 200, commissionPercent: 12, isActive: true },
          { id: '4', vehicleType: 'VAN', vehicleName: 'Van / Cargo', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 8, otherRunningCostPerKm: 15, fixedCostPerKm: 8, profitMultiplier: 3, baseChargeFirstKm: 300, minimumFare: 300, commissionPercent: 15, isActive: true },
        ]);
      }
    } catch (err) {
      console.warn('Failed to load commission settings:', err);
      setSettings([
        { id: '1', vehicleType: 'THREE_WHEEL', vehicleName: 'Three-Wheeler', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 25, otherRunningCostPerKm: 5, fixedCostPerKm: 2, profitMultiplier: 3, baseChargeFirstKm: 150, minimumFare: 150, commissionPercent: 10, isActive: true },
        { id: '2', vehicleType: 'MOTORBIKE', vehicleName: 'Bike / Courier', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 40, otherRunningCostPerKm: 3, fixedCostPerKm: 1, profitMultiplier: 3, baseChargeFirstKm: 100, minimumFare: 100, commissionPercent: 10, isActive: true },
        { id: '3', vehicleType: 'CAR', vehicleName: 'Car / Taxi', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 12, otherRunningCostPerKm: 10, fixedCostPerKm: 5, profitMultiplier: 3, baseChargeFirstKm: 200, minimumFare: 200, commissionPercent: 12, isActive: true },
        { id: '4', vehicleType: 'VAN', vehicleName: 'Van / Cargo', petrolPrice: 350, twoTOilRatio: 0, twoTOilPrice: 0, mileageKmPerLitre: 8, otherRunningCostPerKm: 15, fixedCostPerKm: 8, profitMultiplier: 3, baseChargeFirstKm: 300, minimumFare: 300, commissionPercent: 15, isActive: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCommissionChange = (vehicleType: string, newPercent: any) => {
    setSettings((prev) =>
      prev.map((s) => (s.vehicleType === vehicleType ? { ...s, commissionPercent: newPercent } : s))
    );
  };

  const handleSaveCommission = async (setting: FareSetting) => {
    try {
      setSavingVehicle(setting.vehicleType);
      const updated = await adminApi.updateFareSettings({
        ...setting,
        commissionPercent: parseFloat(String(setting.commissionPercent)) >= 0 ? parseFloat(String(setting.commissionPercent)) : 10,
      });
      setSettings((prev) => prev.map((s) => (s.vehicleType === updated.vehicleType ? updated : s)));
      setSavedSuccess(setting.vehicleType);
      if (onNotify) onNotify(`Commission for ${setting.vehicleName} updated to ${setting.commissionPercent}%!`);
      setTimeout(() => setSavedSuccess(null), 3000);
    } catch (err: any) {
      alert(`Failed to update commission: ${err.message || err}`);
    } finally {
      setSavingVehicle(null);
    }
  };

  const currentSetting = settings.find((s) => s.vehicleType === selectedVehicle) || settings[0];
  const commPercent = currentSetting ? (Number(currentSetting.commissionPercent) || 10) : 10;
  const yaaluRevenue = (simulatedFare * commPercent) / 100;
  const riderPayout = simulatedFare - yaaluRevenue;

  const vehicleIcons: Record<string, any> = {
    THREE_WHEEL: Car,
    MOTORBIKE: Bike,
    CAR: Car,
    VAN: Truck,
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
                backgroundColor: 'rgba(245, 199, 72, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Percent size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
                Platform Commission Management
              </h2>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
                Configure company commission fee percentages (%) and driver revenue splits for all vehicle categories.
              </p>
            </div>
          </div>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadCommissionSettings}>
          <RotateCcw size={14} /> Refresh Rates
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Three-Wheeler Rate</span>
            <Coins size={16} color="var(--color-primary)" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--color-primary)', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'THREE_WHEEL')?.commissionPercent ?? 10}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Standard Tuk Tuk Commission</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Bike / Courier Rate</span>
            <Bike size={16} color="#f7ea00ff" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#10B981', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'MOTORBIKE')?.commissionPercent ?? 10}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Instant Delivery Fee</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Car / Taxi Rate</span>
            <Car size={16} color="#3B82F6" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#3B82F6', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'CAR')?.commissionPercent ?? 12}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Sedan / Passenger Taxi</div>
        </div>

        <div className="card" style={{ padding: 16 }}>
          <div className="flex items-center justify-between" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            <span>Van / Cargo Rate</span>
            <Truck size={16} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#8B5CF6', marginTop: 8 }}>
            {settings.find((s) => s.vehicleType === 'VAN')?.commissionPercent ?? 15}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Large Capacity Trips</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Editable Commission Table per Vehicle */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 15, color: '#FFF' }}>
              <Wallet size={18} color="var(--color-primary)" /> Vehicle Commission Percentages (%)
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Changes apply immediately to new rides</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {settings.map((setting) => {
              const Icon = vehicleIcons[setting.vehicleType] || Car;
              const isSaving = savingVehicle === setting.vehicleType;
              const isSaved = savedSuccess === setting.vehicleType;
              const percent = Number(setting.commissionPercent) || 10;
              const riderPercent = 100 - percent;

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
                          background: 'rgba(245, 199, 72, 0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={50} color="var(--color-primary)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14, color: '#FFF' }}>
                          {setting.vehicleName}
                        </div>
                        <div style={{ fontSize: 19, color: '#400000ff' }}>
                          Category ID: <code>{setting.vehicleType}</code>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm"
                      disabled={isSaving}
                      onClick={() => handleSaveCommission(setting)}
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
                      <label style={{ display: 'block', fontSize: 22, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        Yaalu Platform Share (%):
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="number"
                          step="any"
                          min="0"
                          max="100"
                          value={setting.commissionPercent !== undefined ? setting.commissionPercent : ''}
                          onChange={(e) =>
                            handleCommissionChange(setting.vehicleType, e.target.value)
                          }
                          placeholder="10"
                          style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(245, 199, 72, 0.3)',
                            borderRadius: 8,
                            padding: '8px 12px',
                            color: 'var(--color-primary)',
                            fontSize: 15,
                            fontWeight: 800,
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: 9,
                            fontSize: 16,
                            fontWeight: 800,
                            color: 'var(--color-primary)',
                          }}
                        >
                          %
                        </span>
                      </div>
                    </div>

                    <div
                      style={{
                        background: 'rgba(16, 185, 129, 0.08)',
                        padding: '10px 14px',
                        borderRadius: 8,
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <div style={{ fontSize: 18, color: '#000000ff', fontWeight: 700 }}>
                        🛵 Rider Net Share
                      </div>
                      <div style={{ fontSize: 19, fontWeight: 900, color: '#0e008cff', marginTop: 2 }}>
                        {riderPercent}% <span style={{ fontSize: 18, fontWeight: 600 }}>of trip fare</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Revenue Split Simulator */}
        <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.95) 100%)',
              border: '5px solid rgba(0, 0, 0, 1)',
              padding: 20,
            }}
          >
            <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: 16, color: '#0d00ffff' }}>
                <TrendingUp size={18} /> Live Commission Revenue Calculator
              </div>
              <span className="badge badge-warning">Simulated</span>
            </div>

            {/* Vehicle Selector */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 18, color: '#000000ff', marginBottom: 6 }}>
                Select Vehicle Category:
              </label>
              <div style={{ display: 'flex', gap: 6 }}>
                {settings.map((s) => (
                  <button
                    key={s.vehicleType}
                    onClick={() => setSelectedVehicle(s.vehicleType)}
                    style={{
                      flex: 1,
                      padding: '8px 6px',
                      borderRadius: 8,
                      border: '1px solid #000000ff',
                      background: selectedVehicle === s.vehicleType ? 'var(--color-primary)' : 'rgba(255,255,255,0.06)',
                      color: selectedVehicle === s.vehicleType ? '#0F172A' : 'var(--text-secondary)',
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

            {/* Fare Input */}
            <div style={{ marginBottom: 16 }}>
              <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sample Trip Fare (Rs.):</span>
                <strong style={{ color: '#FFF', fontSize: 15 }}>LKR {simulatedFare.toLocaleString()}</strong>
              </div>

              <input
                type="range"
                min="150"
                max="10000"
                step="50"
                value={simulatedFare}
                onChange={(e) => setSimulatedFare(parseFloat(e.target.value) || 100)}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />

              <div className="flex items-center justify-between" style={{ fontSize: 12.5, color: '#000000ff', marginTop: 4 }}>
                <span>Rs. 150</span>
                <span>Rs. 2,500</span>
                <span>Rs. 5,000</span>
                <span>Rs. 10,000</span>
              </div>
            </div>

            {/* Split Output Card */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 1)',
                padding: 16,
                borderRadius: 12,
                border: '2px solid rgba(0, 0, 0, 1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div className="flex items-center justify-between" style={{ fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>Customer Pays:</span>
                <strong style={{ color: '#FFF' }}>LKR {simulatedFare.toFixed(2)}</strong>
              </div>

              <div
                className="flex items-center justify-between"
                style={{
                  fontSize: 13,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'rgba(245, 199, 72, 0.1)',
                  border: '1px solid rgba(245, 199, 72, 0.25)',
                }}
              >
                <div>
                  <div style={{ color: 'rgba(55, 0, 255, 1)', fontWeight: 800 }}>
                    💼 Yaalu Commission ({commPercent}%)
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Platform Net Profit</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: 'rgba(255, 115, 0, 1)' }}>
                  + LKR {yaaluRevenue.toFixed(2)}
                </div>

              </div>

              <div
                className="flex items-center justify-between"
                style={{
                  fontSize: 13,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'rgba(255, 255, 255, 1)',
                  border: '2px solid rgba(5, 255, 172, 0.25)',
                }}
              >
                <div>
                  <div style={{ color: '#10B981', fontWeight: 800 }}>
                    🛵 Rider Take-Home ({100 - commPercent}%)
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Direct Driver Payout</div>
                </div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#10B981' }}>
                  LKR {riderPayout.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Note */}
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                borderRadius: 8,
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11.5,
                color: '#93C5FD',
              }}
            >
              <Info size={15} style={{ flexShrink: 0 }} />
              <span>
                Commissions are automatically deducted from the rider's in-app wallet balance upon trip completion.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
