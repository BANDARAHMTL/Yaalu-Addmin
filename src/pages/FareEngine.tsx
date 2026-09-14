import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  RotateCcw,
  CheckCircle2,
  Car,
  Bike,
  Truck,
  Fuel,
  TrendingUp,
  Landmark,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import { adminApi } from '../services/api';
import { FareSetting } from '../types';

interface FareEngineProps {
  onNotify?: (msg: string) => void;
}

const DEFAULT_PRESETS: Record<string, Partial<FareSetting>> = {
  THREE_WHEEL: {
    id: 'THREE_WHEEL',
    vehicleType: 'THREE_WHEEL',
    vehicleName: 'Three-Wheeler / Tuk Tuk',
    petrolPrice: 370.0, // B: Price of 1L petrol (LKR)
    twoTOilRatio: 0.02, // C: 2T oil per 1L petrol (L) (20ml)
    twoTOilPrice: 1500.0, // D: Price of 1L 2T oil (LKR)
    mileageKmPerLitre: 25.0, // F: Distance per 1L petrol (km)
    otherRunningCostPerKm: 5.0, // G: Running costs per km (service, tyres, etc.)
    fixedCostPerKm: 3.0, // H: Fixed costs per km (insurance, license, etc.)
    profitMultiplier: 3.0, // J = 3I (Profit = 2I + Cost = I -> 3I)
    baseChargeFirstKm: 150.0, // K: Base charge for 1st km (LKR)
    minimumFare: 150.0,
    commissionPercent: 10.0, // Yaalu Platform Commission %
    bidTimeoutMinutes: 2.0, // Bid countdown window in minutes
    isActive: true,
  },
  MOTORBIKE: {
    id: 'MOTORBIKE',
    vehicleType: 'MOTORBIKE',
    vehicleName: 'Motorbike / Courier',
    petrolPrice: 370.0,
    twoTOilRatio: 0.0,
    twoTOilPrice: 0.0,
    mileageKmPerLitre: 45.0,
    otherRunningCostPerKm: 3.0,
    fixedCostPerKm: 2.0,
    profitMultiplier: 3.0,
    baseChargeFirstKm: 100.0,
    minimumFare: 100.0,
    commissionPercent: 10.0,
    bidTimeoutMinutes: 2.0,
    isActive: true,
  },
  CAR: {
    id: 'CAR',
    vehicleType: 'CAR',
    vehicleName: 'Car / Flex Taxi',
    petrolPrice: 370.0,
    twoTOilRatio: 0.0,
    twoTOilPrice: 0.0,
    mileageKmPerLitre: 14.0,
    otherRunningCostPerKm: 10.0,
    fixedCostPerKm: 6.0,
    profitMultiplier: 3.0,
    baseChargeFirstKm: 250.0,
    minimumFare: 250.0,
    commissionPercent: 12.0,
    bidTimeoutMinutes: 3.0,
    isActive: true,
  },
  VAN: {
    id: 'VAN',
    vehicleType: 'VAN',
    vehicleName: 'Van / Large Delivery',
    petrolPrice: 370.0,
    twoTOilRatio: 0.0,
    twoTOilPrice: 0.0,
    mileageKmPerLitre: 10.0,
    otherRunningCostPerKm: 15.0,
    fixedCostPerKm: 8.0,
    profitMultiplier: 3.0,
    baseChargeFirstKm: 350.0,
    minimumFare: 350.0,
    commissionPercent: 15.0,
    bidTimeoutMinutes: 5.0,
    isActive: true,
  },
};

export const FareEngine: React.FC<FareEngineProps> = ({ onNotify }) => {
  const [activeVehicle, setActiveVehicle] = useState<'THREE_WHEEL' | 'MOTORBIKE' | 'CAR' | 'VAN'>('THREE_WHEEL');
  const [configs, setConfigs] = useState<Record<string, FareSetting>>({});
  const [form, setForm] = useState<Record<string, any>>(DEFAULT_PRESETS.THREE_WHEEL);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [simDistance, setSimDistance] = useState<number>(5.0);

  // Load configs from backend on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await adminApi.getFareSettings();
      if (Array.isArray(data) && data.length > 0) {
        const map: Record<string, FareSetting> = {};
        data.forEach((c) => {
          map[c.vehicleType] = c;
        });
        setConfigs(map);
        if (map[activeVehicle]) {
          setForm({ ...map[activeVehicle] });
        }
      }
    } catch (err) {
      console.warn('Failed to load fare settings:', err);
    }
  };

  const handleSelectVehicle = (vType: 'THREE_WHEEL' | 'MOTORBIKE' | 'CAR' | 'VAN') => {
    setActiveVehicle(vType);
    if (configs[vType]) {
      setForm({ ...configs[vType] });
    } else {
      setForm({ ...DEFAULT_PRESETS[vType] });
    }
    setSavedSuccess(false);
  };

  const handleChange = (field: string, val: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: val,
    }));
    setSavedSuccess(false);
  };

  // ─── Mathematical Formula Calculation Engine ──────────────
  const B = parseFloat(String(form.petrolPrice ?? '')) || 0; // Petrol price / L
  const C = parseFloat(String(form.twoTOilRatio ?? '')) || 0; // 2T oil ratio / L
  const D = parseFloat(String(form.twoTOilPrice ?? '')) || 0; // 2T oil price / L
  const F = parseFloat(String(form.mileageKmPerLitre ?? '')) || 1; // Mileage km/L
  const G = parseFloat(String(form.otherRunningCostPerKm ?? '')) || 0; // Running costs / km
  const H = parseFloat(String(form.fixedCostPerKm ?? '')) || 0; // Fixed costs / km
  const multiplier = parseFloat(String(form.profitMultiplier ?? '')) || 3.0; // Profit multiplier
  const K = parseFloat(String(form.baseChargeFirstKm ?? '')) || 0; // 1st km base fare
  const commissionPercent = parseFloat(String(form.commissionPercent ?? '')) >= 0 ? parseFloat(String(form.commissionPercent)) : 10.0;
  const bidTimeoutMinutes = parseFloat(String(form.bidTimeoutMinutes ?? '')) > 0 ? parseFloat(String(form.bidTimeoutMinutes)) : 2.0;

  // Step 1: Cost of Fuel Mixture A = B + (C * D)
  const A = B + C * D;

  // Step 2: Fuel Cost per Kilometre E = A / F
  const E = F > 0 ? A / F : 0;

  // Step 3: Total Operating Cost per Kilometre I = E + G + H
  const I = E + G + H;

  // Step 4: Rate Charged to Customer per Kilometre J = multiplier * I (Default 3 * I)
  const J = multiplier * I;

  // Step 5: Trip Total Fare L = K + J * (M - 1)
  const M = Math.max(0, simDistance);
  let L = K;
  if (M > 1.0) {
    L = K + J * (M - 1.0);
  }
  const minFare = parseFloat(String(form.minimumFare ?? '')) || K;
  L = Math.max(L, minFare);

  // Platform Commission & Rider Earning calculations
  const commissionAmount = (L * commissionPercent) / 100.0;
  const riderNetEarnings = Math.max(0, L - commissionAmount);
  const bidTimeoutSeconds = Math.round(bidTimeoutMinutes * 60);

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload: Partial<FareSetting> = {
        ...form,
        vehicleType: activeVehicle,
        vehicleName: form.vehicleName || DEFAULT_PRESETS[activeVehicle]?.vehicleName || activeVehicle,
        petrolPrice: parseFloat(String(form.petrolPrice ?? '')) || 370.0,
        twoTOilRatio: parseFloat(String(form.twoTOilRatio ?? '')) >= 0 ? parseFloat(String(form.twoTOilRatio)) : 0.02,
        twoTOilPrice: parseFloat(String(form.twoTOilPrice ?? '')) >= 0 ? parseFloat(String(form.twoTOilPrice)) : 1500.0,
        mileageKmPerLitre: parseFloat(String(form.mileageKmPerLitre ?? '')) > 0 ? parseFloat(String(form.mileageKmPerLitre)) : 25.0,
        otherRunningCostPerKm: parseFloat(String(form.otherRunningCostPerKm ?? '')) >= 0 ? parseFloat(String(form.otherRunningCostPerKm)) : 5.0,
        fixedCostPerKm: parseFloat(String(form.fixedCostPerKm ?? '')) >= 0 ? parseFloat(String(form.fixedCostPerKm)) : 3.0,
        profitMultiplier: parseFloat(String(form.profitMultiplier ?? '')) > 0 ? parseFloat(String(form.profitMultiplier)) : 3.0,
        baseChargeFirstKm: parseFloat(String(form.baseChargeFirstKm ?? '')) >= 0 ? parseFloat(String(form.baseChargeFirstKm)) : 150.0,
        minimumFare: parseFloat(String(form.minimumFare ?? '')) >= 0 ? parseFloat(String(form.minimumFare)) : (parseFloat(String(form.baseChargeFirstKm ?? '')) || 150.0),
        commissionPercent: parseFloat(String(form.commissionPercent ?? '')) >= 0 ? parseFloat(String(form.commissionPercent)) : 10.0,
        bidTimeoutMinutes: parseFloat(String(form.bidTimeoutMinutes ?? '')) > 0 ? parseFloat(String(form.bidTimeoutMinutes)) : 2.0,
      };

      const updated = await adminApi.updateFareSettings(payload);
      setConfigs((prev) => ({ ...prev, [activeVehicle]: updated }));
      setForm({ ...updated });
      setSavedSuccess(true);
      if (onNotify) onNotify(`Fare formula for ${activeVehicle} saved successfully!`);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(`Failed to save fare settings: ${err.message || err}`);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm(`Reset ${activeVehicle} formula variables to standard defaults?`)) {
      setForm(DEFAULT_PRESETS[activeVehicle]);
      setSavedSuccess(false);
    }
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div className="flex items-center justify-between" style={{ flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div className="flex items-center gap-2.5">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(245, 199, 72, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calculator size={20} color="var(--color-primary)" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>
              Taxi & Three-Wheeler Fare Pricing Engine
            </h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Dynamic mathematical distance formula calculation for 1 km rate and passenger trip fares.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="btn btn-secondary btn-sm" onClick={handleResetDefaults}>
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving}
            style={{ minWidth: 140 }}
          >
            {saving ? (
              'Saving...'
            ) : savedSuccess ? (
              <>
                <CheckCircle2 size={14} /> Saved & Active!
              </>
            ) : (
              <>
                <Save size={14} /> Save Pricing Formula
              </>
            )}
          </button>
        </div>
      </div>

      {/* Vehicle Type Selection Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          background: 'rgba(255,255,255,0.03)',
          padding: 6,
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {[
          { key: 'THREE_WHEEL', label: 'Three-Wheeler / Tuk Tuk', icon: Car, tag: 'Standard 2T/4T Model' },
          { key: 'MOTORBIKE', label: 'Motorbike / Delivery', icon: Bike, tag: 'High Mileage' },
          { key: 'CAR', label: 'Car / Flex Taxi', icon: Car, tag: 'AC / Sedan' },
          { key: 'VAN', label: 'Van / Large Cargo', icon: Truck, tag: 'Multi-Passenger' },
        ].map((v) => {
          const Icon = v.icon;
          const isSelected = activeVehicle === v.key;
          return (
            <button
              key={v.key}
              onClick={() => handleSelectVehicle(v.key as any)}
              style={{
                flex: 1,
                padding: '12px 14px',
                borderRadius: 10,
                border: 'none',
                background: isSelected ? 'var(--color-primary)' : 'transparent',
                color: isSelected ? '#0F172A' : 'var(--text-secondary)',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={18} color={isSelected ? '#0F172A' : 'var(--text-muted)'} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, lineHeight: 1.2 }}>{v.label}</div>
                <div style={{ fontSize: 10.5, opacity: isSelected ? 0.8 : 0.5, marginTop: 2 }}>{v.tag}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Formula Mathematical Blueprint Visual Banner */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
          border: '1px solid rgba(245, 199, 72, 0.25)',
          padding: 20,
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <div className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: 14, color: 'var(--color-primary)' }}>
            <Compass size={18} /> Official Formula Steps (Standard Distance Pricing)
          </div>
          <span className="badge badge-warning" style={{ fontWeight: 800 }}>
            Active Formula: L = K + 3(E + G + H) × (M - 1)
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2.5" style={{ fontSize: 12 }}>
          {/* Step 1 */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Step 1: Fuel Mixture
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#FFF', marginTop: 4 }}>
              A = B + C × D
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Petrol + 2T oil cost: <strong style={{ color: '#10B981' }}>LKR {A.toFixed(2)}/L</strong>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Step 2: Fuel Cost / km
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#FFF', marginTop: 4 }}>
              E = A / F
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Cost per km fuel: <strong style={{ color: '#10B981' }}>LKR {E.toFixed(2)}/km</strong>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Step 3: Driver Cost / km
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#FFF', marginTop: 4 }}>
              I = E + G + H
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              True operating cost: <strong style={{ color: '#F59E0B' }}>LKR {I.toFixed(2)}/km</strong>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ background: 'rgba(255,255,255,0.04)', padding: 12, borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Step 4: Rate Charged / km
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: '#FFF', marginTop: 4 }}>
              J = 3 × I
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              Customer rate: <strong style={{ color: 'var(--color-primary)' }}>LKR {J.toFixed(2)}/km</strong>
            </div>
          </div>

          {/* Step 5 */}
          <div style={{ background: 'rgba(245, 199, 72, 0.08)', padding: 12, borderRadius: 10, border: '1px solid rgba(245, 199, 72, 0.3)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Step 5: Total Trip Fare
            </div>
            <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'monospace', color: 'var(--color-primary)', marginTop: 4 }}>
              L = K + J × (M - 1)
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              1st km: <strong>LKR {K.toFixed(0)}</strong> + extra km rate
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Editable Formula Parameters (Variables B, C, D, F, G, H, K, Multiplier) */}
        <div className="col-span-7 card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12 }}>
            <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 15, color: '#FFF' }}>
              <Fuel size={18} color="var(--color-primary)" /> Formula Variables & Operating Parameters
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Edit values below to adjust rates</span>
          </div>

          {/* Section 1: Fuel & Mixture Costs (B, C, D, F) */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 10 }}>
              Fuel & Lubricant Mixture Variables (B, C, D, F)
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* B: Petrol Price */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(B)</strong> Petrol Price per Litre (LKR):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.petrolPrice !== undefined ? form.petrolPrice : ''}
                    onChange={(e) => handleChange('petrolPrice', e.target.value)}
                    placeholder="370"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    Rs/L
                  </span>
                </div>
              </div>

              {/* F: Mileage */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(F)</strong> Mileage (Distance per Litre):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.mileageKmPerLitre !== undefined ? form.mileageKmPerLitre : ''}
                    onChange={(e) => handleChange('mileageKmPerLitre', e.target.value)}
                    placeholder="25"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    km/L
                  </span>
                </div>
              </div>

              {/* C: 2T Oil Ratio */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(C)</strong> 2T Oil Required per 1L Petrol:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.twoTOilRatio !== undefined ? form.twoTOilRatio : ''}
                    onChange={(e) => handleChange('twoTOilRatio', e.target.value)}
                    placeholder="0.02"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    Litres (0.02L = 20ml)
                  </span>
                </div>
              </div>

              {/* D: 2T Oil Price */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(D)</strong> Price of 1L 2T Oil (LKR):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.twoTOilPrice !== undefined ? form.twoTOilPrice : ''}
                    onChange={(e) => handleChange('twoTOilPrice', e.target.value)}
                    placeholder="1500"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    Rs/L
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Other Running Costs & Fixed Costs (G, H) */}
          <div style={{ paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 10 }}>
              Operating & Maintenance Costs (G, H)
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* G: Other Running Costs */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(G)</strong> Other Running Costs (Service, Tyres) / km:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.otherRunningCostPerKm !== undefined ? form.otherRunningCostPerKm : ''}
                    onChange={(e) => handleChange('otherRunningCostPerKm', e.target.value)}
                    placeholder="5"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    Rs/km
                  </span>
                </div>
              </div>

              {/* H: Fixed Costs */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(H)</strong> Fixed Costs per km (Insurance, License):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.fixedCostPerKm !== undefined ? form.fixedCostPerKm : ''}
                    onChange={(e) => handleChange('fixedCostPerKm', e.target.value)}
                    placeholder="3"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    Rs/km
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Base Fare & Profit Multiplier (K, Multiplier) */}
          <div style={{ paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 10 }}>
              Base Charge & Profit Multiplier (K, J)
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* K: Base Charge */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>(K)</strong> Base Charge for First Kilometre:
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.baseChargeFirstKm !== undefined ? form.baseChargeFirstKm : ''}
                    onChange={(e) => handleChange('baseChargeFirstKm', e.target.value)}
                    placeholder="150"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    LKR (1st km)
                  </span>
                </div>
              </div>

              {/* Profit Multiplier (3x) */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  Profit Multiplier on Operating Cost (J = Multiplier × I):
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    value={form.profitMultiplier !== undefined ? form.profitMultiplier : ''}
                    onChange={(e) => handleChange('profitMultiplier', e.target.value)}
                    placeholder="3.0"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--text-primary)',
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    × (Default 3.0)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Yaalu Platform Commission & Bidding Timeout Controls */}
          <div
            style={{
              paddingTop: 14,
              borderTop: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(245, 199, 72, 0.03)',
              padding: 14,
              borderRadius: 12,
              border: '1px solid rgba(245, 199, 72, 0.2)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              💼 Platform Commission (%) & Rider Bidding Time Limit
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Platform Commission (%) */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>Yaalu Platform Commission (%):</strong>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    min="0"
                    max="100"
                    value={form.commissionPercent !== undefined ? form.commissionPercent : ''}
                    onChange={(e) => handleChange('commissionPercent', e.target.value)}
                    placeholder="10"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(245, 199, 72, 0.3)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: 'var(--color-primary)',
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 12, fontWeight: 800, color: 'var(--color-primary)' }}>
                    %
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4 }}>
                  Company profit deducted from ride fare
                </div>
              </div>

              {/* Bid Timeout (Minutes) */}
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                  <strong>Rider Bid Timeout Window (Minutes):</strong>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="number"
                    step="any"
                    min="0.25"
                    max="30"
                    value={form.bidTimeoutMinutes !== undefined ? form.bidTimeoutMinutes : ''}
                    onChange={(e) => handleChange('bidTimeoutMinutes', e.target.value)}
                    placeholder="2.0"
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: 8,
                      padding: '8px 12px',
                      color: '#60A5FA',
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  />
                  <span style={{ position: 'absolute', right: 10, top: 9, fontSize: 11, color: 'var(--text-muted)' }}>
                    Mins ({bidTimeoutSeconds}s)
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', marginTop: 4 }}>
                  Countdown limit for riders to accept / bid
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Breakdown & Trip Simulator (M km -> L) */}
        <div className="col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Real-time Calculated Rates Box */}
          <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: 18 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
              <div className="flex items-center gap-2" style={{ fontWeight: 700, fontSize: 14, color: '#FFF' }}>
                <TrendingUp size={16} color="#10B981" /> Computed Rates Breakdown
              </div>
              <span className="badge badge-success">Live Recalculated</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="flex items-center justify-between" style={{ fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Fuel Mixture Cost <strong>(A)</strong>:</span>
                <span style={{ fontWeight: 700, color: '#FFF' }}>Rs. {A.toFixed(2)} / L</span>
              </div>

              <div className="flex items-center justify-between" style={{ fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Fuel Cost per 1 km <strong>(E)</strong>:</span>
                <span style={{ fontWeight: 700, color: '#FFF' }}>Rs. {E.toFixed(2)} / km</span>
              </div>

              <div className="flex items-center justify-between" style={{ fontSize: 13, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                <span style={{ color: 'var(--text-muted)' }}>Driver True Cost per km <strong>(I)</strong>:</span>
                <span style={{ fontWeight: 700, color: '#F59E0B' }}>Rs. {I.toFixed(2)} / km</span>
              </div>

              <div
                className="flex items-center justify-between"
                style={{
                  fontSize: 14,
                  background: 'rgba(245, 199, 72, 0.1)',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(245, 199, 72, 0.25)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>1 KM Hire Fee (J)</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Charged to Customer after 1st km</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--color-primary)' }}>
                  Rs. {J.toFixed(2)} <span style={{ fontSize: 12 }}>/ km</span>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ fontSize: 12, paddingTop: 4 }}>
                <span style={{ color: 'var(--text-muted)' }}>⏱️ Rider Bid Countdown Window:</span>
                <span className="badge badge-info" style={{ fontWeight: 800 }}>
                  {bidTimeoutMinutes} min ({bidTimeoutSeconds} sec)
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live Trip Simulator (M km -> L Fare) */}
          <div
            className="card"
            style={{
              background: 'linear-gradient(135deg, rgba(11, 16, 68, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: 20,
            }}
          >
            <div className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: 14, color: '#60A5FA', marginBottom: 12 }}>
              <Compass size={18} /> Live Trip Fare & Revenue Split Simulator
            </div>

            <div style={{ marginBottom: 16 }}>
              <div className="flex items-center justify-between" style={{ fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Trip Distance <strong>(M)</strong>:</span>
                <strong style={{ color: 'var(--color-primary)', fontSize: 15 }}>{simDistance.toFixed(1)} km</strong>
              </div>

              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={simDistance}
                onChange={(e) => setSimDistance(parseFloat(e.target.value) || 1)}
                style={{ width: '100%', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
              />

              <div className="flex items-center justify-between" style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                <span>0.5 km (Base)</span>
                <span>10 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>

            {/* Simulated Fare Output Box */}
            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: 14,
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>1st km Base Charge (K):</span>
                <span>Rs. {K.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  Extra Distance ({Math.max(0, M - 1).toFixed(1)} km × Rs. {J.toFixed(2)}):
                </span>
                <span>Rs. {(Math.max(0, M - 1) * J).toFixed(2)}</span>
              </div>

              {/* Final Customer Fare */}
              <div
                className="flex items-center justify-between"
                style={{
                  paddingTop: 8,
                  marginTop: 4,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 800 }}>
                    Final Customer Fare (L)
                  </div>
                </div>

                <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--color-primary)' }}>
                  LKR {L.toFixed(2)}
                </div>
              </div>

              {/* Revenue Split: Platform Commission vs Rider Net */}
              <div
                style={{
                  marginTop: 6,
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: '#F59E0B', fontWeight: 700 }}>
                    💼 Yaalu Commission ({commissionPercent}%):
                  </span>
                  <span style={{ color: '#F59E0B', fontWeight: 800 }}>
                    + LKR {commissionAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between" style={{ fontSize: 12 }}>
                  <span style={{ color: '#10B981', fontWeight: 700 }}>
                    🛵 Rider Net Payout ({100 - commissionPercent}%):
                  </span>
                  <span style={{ color: '#10B981', fontWeight: 800 }}>
                    LKR {riderNetEarnings.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
