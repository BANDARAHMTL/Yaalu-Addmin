export type Role = 'CUSTOMER' | 'SHOP' | 'RIDER' | 'ADMIN';

export type RiderStatus = 'PENDING' | 'AVAILABLE' | 'BUSY' | 'OFFLINE' | 'SUSPENDED';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type InvoiceStatus = 'pending' | 'paid';

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
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
  bankName?: string;
  accountName?: string;
  accountNo?: string;
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
  createdAt: string;
}

export interface Product {
  id: string;
  merchantId: string;
  merchantName?: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
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
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  merchantId?: string;
  name: string;
  mobile?: string;
  email?: string;
  address?: string;
  notes?: string;
  totalOrders?: number;
  totalSpent?: number;
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
  todayOrders: number;
  monthlyGrowth: number;
}
