export type Role = 'CUSTOMER' | 'SHOP' | 'RIDER' | 'ADMIN';

export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED';

export type RiderStatus = 'PENDING' | 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'SUSPENDED';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type InvoiceStatus = 'pending' | 'paid';

export type PaymentMethod = 'BANK_TRANSFER' | 'CARD' | 'CASH_ON_DELIVERY' | 'QR_PAY';

export type PaymentVerificationStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  customerProfile?: {
    deliveryAddress?: string;
    city?: string;
    totalOrders?: number;
  };
  shopProfile?: {
    shopName: string;
    businessType?: string;
    registrationNo?: string;
    shopAddress?: string;
    isVerified?: boolean;
  };
  riderProfile?: {
    vehicleType: string;
    vehicleNumber: string;
    licenseNumber: string;
    isApproved: boolean;
  };
}

export interface PaymentTransaction {
  id: string;
  invoiceId?: string;
  orderId?: string;
  merchantId?: string;
  merchantName: string;
  customerId?: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentVerificationStatus;
  referenceNo?: string;
  bankName?: string;
  slipUrl?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface Merchant {
  id: string;
  userId?: string;
  shopName: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  businessType?: string;
  shopAddress?: string;
  outletAddress?: string;
  registrationNo?: string;
  // Bank & Payout Details
  bankName?: string;
  accountName?: string;
  accountNo?: string;
  accountBranch?: string;
  // Card Payment Details
  cardLast4?: string;
  cardType?: string;
  logoUrl?: string;
  bannerUrl?: string;
  isVerified?: boolean;
  status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED';
  totalProducts?: number;
  totalOrders?: number;
  revenue?: number;
  createdAt: string;
}

export interface Rider {
  id: string;
  userId?: string;
  fullName: string;
  phone: string;
  email?: string;
  nicNumber?: string;
  profilePhotoUrl?: string;
  address?: string;
  city?: string;
  vehicleType: 'MOTORBIKE' | 'SCOOTER' | 'THREE_WHEEL' | 'CAR' | 'VAN';
  vehicleNumber: string;
  vehicleModel?: string;
  licenseNumber: string;
  licenseExpiry?: string;
  licenseFrontUrl?: string;
  licenseBackUrl?: string;
  status: RiderStatus;
  isApproved: boolean;
  currentLatitude?: number;
  currentLongitude?: number;
  deliveriesCompleted?: number;
  rating?: number;
  // Bank Payout Details
  bankName?: string;
  accountName?: string;
  accountNo?: string;
  accountBranch?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  merchantId: string;
  merchantName?: string;
  name: string;
  sku?: string;
  price: number;
  costPrice?: number;
  unit: string;
  stock: number;
  lowStockThreshold?: number;
  imageUrl?: string;
  description?: string;
  isActive: boolean;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  merchantId: string;
  merchantName?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  notes?: string;
  deliveryAddress?: string;
  riderId?: string;
  riderName?: string;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  merchantId?: string;
  userId?: string;
  name: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
  // Card Payment Details
  cardLast4?: string;
  cardType?: string;
  billingAddress?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  merchantId: string;
  merchantName?: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

export interface SystemStats {
  totalRevenue: number;
  totalOrders: number;
  totalMerchants: number;
  activeRiders: number;
  pendingApprovals: number;
  pendingPaymentsCount: number;
  totalUsers: number;
  todayOrders: number;
  monthlyGrowth: number;
}

export interface FareSetting {
  id: string;
  vehicleType: string;
  vehicleName: string;
  petrolPrice: number; // B: Price of 1L petrol
  twoTOilRatio: number; // C: Amount of 2T oil per 1L petrol (L)
  twoTOilPrice: number; // D: Price of 1L 2T oil
  mileageKmPerLitre: number; // F: Distance per 1L petrol (km)
  otherRunningCostPerKm: number; // G: Running costs per km (service, tyres, etc.)
  fixedCostPerKm: number; // H: Fixed costs per km
  profitMultiplier: number; // Multiplier (default 3x: J = 3I)
  baseChargeFirstKm: number; // K: Base charge for 1st km
  minimumFare: number;
  commissionPercent?: number; // Platform commission % (e.g. 10%)
  bidTimeoutMinutes?: number; // Bid countdown window in minutes (e.g. 2 mins)
  bidTimeoutSeconds?: number;
  isActive: boolean;
  variables?: {
    A_fuelMixtureCostPerLitre: number;
    B_petrolPricePerLitre: number;
    C_twoTOilRatioPerLitre: number;
    D_twoTOilPricePerLitre: number;
    E_fuelCostPerKm: number;
    F_mileageKmPerLitre: number;
    G_runningCostPerKm: number;
    H_fixedCostPerKm: number;
    I_driverOperatingCostPerKm: number;
    J_customerRatePerKm: number;
    K_baseChargeFirstKm: number;
    M_distanceKm?: number;
    L_totalTripFare?: number;
    commissionPercent?: number;
    commissionAmount?: number;
    riderNetEarnings?: number;
    bidTimeoutMinutes?: number;
    bidTimeoutSeconds?: number;
  };
  formulaSummary?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    commission?: string;
    bidTimeout?: string;
  };
}

export interface FareCalculationResult {
  distanceKm: number;
  vehicleType: string;
  perKmRate: number;
  baseCharge: number;
  totalFare: number;
  commissionPercent?: number;
  commissionAmount?: number;
  riderNetEarnings?: number;
  bidTimeoutMinutes?: number;
  bidTimeoutSeconds?: number;
  breakdown: {
    fuelMixtureCostPerLitre: number;
    fuelCostPerKm: number;
    operatingCostPerKm: number;
    ratePerKm: number;
    baseChargeFirstKm: number;
    totalFare: number;
    commissionAmount?: number;
    riderNetEarnings?: number;
  };
}
