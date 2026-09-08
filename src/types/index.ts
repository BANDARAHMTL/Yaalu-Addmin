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
  vehicleType: 'MOTORBIKE' | 'SCOOTER' | 'THREE_WHEEL' | 'CAR' | 'VAN';
  vehicleNumber: string;
  vehicleModel?: string;
  licenseNumber: string;
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
