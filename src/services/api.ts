import {
  Customer,
  Invoice,
  Merchant,
  Order,
  PaymentTransaction,
  Product,
  Rider,
  SystemStats,
  UserAccount,
} from '../types';

const API_BASE_URL = 'http://localhost:3001';

// Initial Users Mock Data
const INITIAL_USERS: UserAccount[] = [
  {
    id: 'u-101',
    email: 'admin@yaalu.lk',
    fullName: 'System Super Admin',
    phone: '+94 77 000 1122',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    createdAt: '2026-08-01T08:00:00Z',
    updatedAt: '2026-09-01T12:00:00Z',
  },
  {
    id: 'u-102',
    email: 'sunil@freshharvest.lk',
    fullName: 'Sunil Perera',
    phone: '+94 77 123 4567',
    role: 'SHOP',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    shopProfile: {
      shopName: 'Fresh Harvest Supermarket',
      businessType: 'Supermarket & Grocery',
      registrationNo: 'PV-88921',
      shopAddress: 'No. 45, Galle Road, Colombo 03',
      isVerified: true,
    },
    createdAt: '2026-08-10T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'u-103',
    email: 'kasun.b@yaalu.lk',
    fullName: 'Kasun Bandara',
    phone: '+94 77 345 6789',
    role: 'RIDER',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    riderProfile: {
      vehicleType: 'MOTORBIKE',
      vehicleNumber: 'WP BCD-4512',
      licenseNumber: 'B-8839201',
      isApproved: true,
    },
    createdAt: '2026-08-12T08:00:00Z',
    updatedAt: '2026-09-03T11:00:00Z',
  },
  {
    id: 'u-104',
    email: 'anura.k@gmail.com',
    fullName: 'Anura Kumara',
    phone: '+94 77 998 1122',
    role: 'CUSTOMER',
    status: 'ACTIVE',
    customerProfile: {
      deliveryAddress: '24/B, Flower Road, Colombo 07',
      city: 'Colombo',
      totalOrders: 14,
    },
    createdAt: '2026-08-01T12:00:00Z',
    updatedAt: '2026-09-04T08:30:00Z',
  },
  {
    id: 'u-105',
    email: 'dilan.m@yaalu.lk',
    fullName: 'Dilan Madushanka',
    phone: '+94 75 901 2345',
    role: 'RIDER',
    status: 'PENDING',
    riderProfile: {
      vehicleType: 'SCOOTER',
      vehicleNumber: 'WP BEG-1120',
      licenseNumber: 'B-4458920',
      isApproved: false,
    },
    createdAt: '2026-09-03T16:45:00Z',
    updatedAt: '2026-09-03T16:45:00Z',
  },
  {
    id: 'u-106',
    email: 'royalspice@gmail.com',
    fullName: 'Mohamed Farook',
    phone: '+94 76 554 1122',
    role: 'SHOP',
    status: 'PENDING',
    shopProfile: {
      shopName: 'Royal Spice & Grocery Hub',
      businessType: 'Wholesale & Spices',
      registrationNo: 'BR-99120',
      shopAddress: '78 Main Street, Pettah, Colombo 11',
      isVerified: false,
    },
    createdAt: '2026-09-02T14:20:00Z',
    updatedAt: '2026-09-02T14:20:00Z',
  },
];

// Initial Payment Verification Mock Data
const INITIAL_PAYMENTS: PaymentTransaction[] = [
  {
    id: 'pay-501',
    invoiceId: 'inv-101',
    orderId: 'ord-901',
    merchantName: 'Fresh Harvest Supermarket',
    customerName: 'Anura Kumara',
    amount: 3840,
    method: 'CARD',
    status: 'VERIFIED',
    referenceNo: 'TXN-9988231',
    verifiedBy: 'System Gateway (IPG)',
    verifiedAt: '2026-09-04T08:31:00Z',
    createdAt: '2026-09-04T08:30:00Z',
  },
  {
    id: 'pay-502',
    invoiceId: 'inv-102',
    orderId: 'ord-902',
    merchantName: 'Green Leaf Organic Store',
    customerName: 'Sujatha Alwis',
    amount: 2260,
    method: 'BANK_TRANSFER',
    status: 'PENDING_VERIFICATION',
    referenceNo: 'SLIP-COMM-44912',
    bankName: 'Commercial Bank of Ceylon',
    slipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-09-04T09:10:00Z',
  },
  {
    id: 'pay-503',
    invoiceId: 'inv-103',
    orderId: 'ord-903',
    merchantName: 'Fresh Harvest Supermarket',
    customerName: 'Raveen Fernando',
    amount: 1440,
    method: 'QR_PAY',
    status: 'PENDING_VERIFICATION',
    referenceNo: 'LANKAQR-88912',
    bankName: 'Sampath Bank',
    slipUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-09-04T09:48:00Z',
  },
  {
    id: 'pay-504',
    merchantName: 'City Bakers & Mart',
    customerName: 'Kamal Gunaratne',
    amount: 5800,
    method: 'BANK_TRANSFER',
    status: 'REJECTED',
    referenceNo: 'SLIP-INVALID-001',
    rejectionReason: 'Bank slip transfer amount did not match invoice total',
    verifiedBy: 'Administrator',
    verifiedAt: '2026-09-03T15:20:00Z',
    createdAt: '2026-09-03T14:00:00Z',
  },
];

const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: 'm-001',
    shopName: 'Fresh Harvest Supermarket',
    ownerName: 'Sunil Perera',
    ownerEmail: 'sunil@freshharvest.lk',
    ownerPhone: '+94 77 123 4567',
    businessType: 'Supermarket & Grocery',
    shopAddress: 'No. 45, Galle Road, Colombo 03',
    registrationNo: 'PV-88921',
    bankName: 'Commercial Bank',
    accountName: 'Fresh Harvest Pvt Ltd',
    accountNo: '8830029102',
    logoUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    isVerified: true,
    totalProducts: 48,
    totalOrders: 312,
    revenue: 485000,
    createdAt: '2026-08-10T10:00:00Z',
  },
  {
    id: 'm-002',
    shopName: 'Green Leaf Organic Store',
    ownerName: 'Nimali Jayasinghe',
    ownerEmail: 'greenleaf@organic.lk',
    ownerPhone: '+94 71 889 2233',
    businessType: 'Organic Produce',
    shopAddress: '12 Kandy Road, Kadawatha',
    registrationNo: 'BR-44910',
    bankName: 'Sampath Bank',
    accountName: 'Green Leaf Organics',
    accountNo: '0104882910',
    logoUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=200&auto=format&fit=crop&q=80',
    status: 'ACTIVE',
    isVerified: true,
    totalProducts: 32,
    totalOrders: 184,
    revenue: 290000,
    createdAt: '2026-08-15T11:30:00Z',
  },
  {
    id: 'm-003',
    shopName: 'Royal Spice & Grocery Hub',
    ownerName: 'Mohamed Farook',
    ownerEmail: 'royalspice@gmail.com',
    ownerPhone: '+94 76 554 1122',
    businessType: 'Wholesale & Spices',
    shopAddress: '78 Main Street, Pettah, Colombo 11',
    registrationNo: 'BR-99120',
    status: 'PENDING_APPROVAL',
    isVerified: false,
    totalProducts: 15,
    totalOrders: 0,
    revenue: 0,
    createdAt: '2026-09-02T14:20:00Z',
  },
  {
    id: 'm-004',
    shopName: 'City Bakers & Mart',
    ownerName: 'Kamal Gunaratne',
    ownerEmail: 'citybakers@yaalu.lk',
    ownerPhone: '+94 70 332 9988',
    businessType: 'Bakery & Mart',
    shopAddress: '33 High Level Road, Nugegoda',
    registrationNo: 'PV-10293',
    status: 'ACTIVE',
    isVerified: true,
    totalProducts: 24,
    totalOrders: 98,
    revenue: 145000,
    createdAt: '2026-08-20T09:15:00Z',
  },
];

const INITIAL_RIDERS: Rider[] = [
  {
    id: 'r-101',
    fullName: 'Kasun Bandara',
    phone: '+94 77 345 6789',
    email: 'kasun.b@yaalu.lk',
    vehicleType: 'MOTORBIKE',
    vehicleNumber: 'WP BCD-4512',
    vehicleModel: 'Honda Dio 110',
    licenseNumber: 'B-8839201',
    status: 'AVAILABLE',
    isApproved: true,
    deliveriesCompleted: 142,
    rating: 4.9,
    createdAt: '2026-08-12T08:00:00Z',
  },
  {
    id: 'r-102',
    fullName: 'Nuwan Pradeep',
    phone: '+94 71 223 9911',
    email: 'nuwan.p@gmail.com',
    vehicleType: 'THREE_WHEEL',
    vehicleNumber: 'WP AAQ-8902',
    vehicleModel: 'Bajaj RE 4S',
    licenseNumber: 'B-7728192',
    status: 'BUSY',
    isApproved: true,
    deliveriesCompleted: 98,
    rating: 4.8,
    createdAt: '2026-08-18T10:30:00Z',
  },
  {
    id: 'r-103',
    fullName: 'Dilan Madushanka',
    phone: '+94 75 901 2345',
    email: 'dilan.m@yaalu.lk',
    vehicleType: 'SCOOTER',
    vehicleNumber: 'WP BEG-1120',
    vehicleModel: 'Yamaha RayZR',
    licenseNumber: 'B-4458920',
    status: 'PENDING',
    isApproved: false,
    deliveriesCompleted: 0,
    rating: 5.0,
    createdAt: '2026-09-03T16:45:00Z',
  },
  {
    id: 'r-104',
    fullName: 'Chaminda Silva',
    phone: '+94 78 667 8901',
    email: 'chaminda.s@gmail.com',
    vehicleType: 'MOTORBIKE',
    vehicleNumber: 'WP BGH-9932',
    vehicleModel: 'Bajaj Pulsar 150',
    licenseNumber: 'B-9918230',
    status: 'OFFLINE',
    isApproved: true,
    deliveriesCompleted: 210,
    rating: 4.95,
    createdAt: '2026-08-05T09:00:00Z',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    merchantId: 'm-001',
    merchantName: 'Fresh Harvest Supermarket',
    name: 'Keeri Samba Rice (Premium)',
    sku: 'RICE-KS-001',
    price: 320,
    costPrice: 280,
    unit: 'kg',
    stock: 250,
    lowStockThreshold: 30,
    category: 'Rice & Grains',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
    description: 'Polished long-grain aroma rich Keeri Samba rice directly from Anuradhapura.',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
  },
  {
    id: 'p-2',
    merchantId: 'm-001',
    merchantName: 'Fresh Harvest Supermarket',
    name: 'Fresh Red Onions (Local)',
    sku: 'VEG-ON-002',
    price: 480,
    costPrice: 390,
    unit: 'kg',
    stock: 85,
    lowStockThreshold: 15,
    category: 'Vegetables',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80',
    description: 'Freshly harvested Jaffna red onions.',
    createdAt: '2026-08-21T10:00:00Z',
    updatedAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'p-3',
    merchantId: 'm-002',
    merchantName: 'Green Leaf Organic Store',
    name: 'Organic Cavendish Bananas',
    sku: 'FRU-BAN-003',
    price: 260,
    costPrice: 200,
    unit: 'kg',
    stock: 40,
    lowStockThreshold: 10,
    category: 'Fruits',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&auto=format&fit=crop&q=80',
    description: 'Naturally ripened organic bananas without artificial chemicals.',
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'p-4',
    merchantId: 'm-002',
    merchantName: 'Green Leaf Organic Store',
    name: 'Pure Ceylon Cinnamon Sticks',
    sku: 'SPC-CIN-004',
    price: 750,
    costPrice: 580,
    unit: 'pack (100g)',
    stock: 65,
    lowStockThreshold: 10,
    category: 'Spices',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=400&auto=format&fit=crop&q=80',
    description: 'Grade Alba organic true Ceylon cinnamon from Matara.',
    createdAt: '2026-08-23T10:00:00Z',
    updatedAt: '2026-09-03T10:00:00Z',
  },
  {
    id: 'p-5',
    merchantId: 'm-004',
    merchantName: 'City Bakers & Mart',
    name: 'Highland Fresh Full Cream Milk 1L',
    sku: 'DAI-MLK-005',
    price: 490,
    costPrice: 420,
    unit: 'pack',
    stock: 120,
    lowStockThreshold: 20,
    category: 'Dairy',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80',
    description: '100% Sri Lankan fresh pasteurized whole cow milk.',
    createdAt: '2026-08-25T10:00:00Z',
    updatedAt: '2026-09-04T10:00:00Z',
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-901',
    merchantId: 'm-001',
    merchantName: 'Fresh Harvest Supermarket',
    customerId: 'c-01',
    customerName: 'Anura Kumara',
    customerPhone: '+94 77 998 1122',
    deliveryAddress: '24/B, Flower Road, Colombo 07',
    status: 'delivered',
    totalAmount: 3840,
    riderName: 'Kasun Bandara',
    paymentMethod: 'CARD',
    items: [
      { id: 'item-1', productName: 'Keeri Samba Rice (Premium)', quantity: 5, unitPrice: 320, subtotal: 1600 },
      { id: 'item-2', productName: 'Fresh Red Onions (Local)', quantity: 2, unitPrice: 480, subtotal: 960 },
      { id: 'item-3', productName: 'Highland Fresh Full Cream Milk 1L', quantity: 2, unitPrice: 490, subtotal: 980 },
    ],
    notes: 'Please leave at the front gate security.',
    createdAt: '2026-09-04T08:30:00Z',
    updatedAt: '2026-09-04T09:15:00Z',
  },
  {
    id: 'ord-902',
    merchantId: 'm-002',
    merchantName: 'Green Leaf Organic Store',
    customerId: 'c-02',
    customerName: 'Sujatha Alwis',
    customerPhone: '+94 71 445 6677',
    deliveryAddress: '15/3 Templers Road, Mount Lavinia',
    status: 'processing',
    totalAmount: 2260,
    riderName: 'Nuwan Pradeep',
    paymentMethod: 'BANK_TRANSFER',
    items: [
      { id: 'item-4', productName: 'Organic Cavendish Bananas', quantity: 3, unitPrice: 260, subtotal: 780 },
      { id: 'item-5', productName: 'Pure Ceylon Cinnamon Sticks', quantity: 2, unitPrice: 750, subtotal: 1500 },
    ],
    createdAt: '2026-09-04T09:05:00Z',
    updatedAt: '2026-09-04T09:20:00Z',
  },
  {
    id: 'ord-903',
    merchantId: 'm-001',
    merchantName: 'Fresh Harvest Supermarket',
    customerId: 'c-03',
    customerName: 'Raveen Fernando',
    customerPhone: '+94 76 112 3344',
    deliveryAddress: '88 Negombo Road, Wattala',
    status: 'pending',
    totalAmount: 1440,
    paymentMethod: 'QR_PAY',
    items: [
      { id: 'item-6', productName: 'Fresh Red Onions (Local)', quantity: 3, unitPrice: 480, subtotal: 1440 },
    ],
    notes: 'Call before arriving',
    createdAt: '2026-09-04T09:45:00Z',
    updatedAt: '2026-09-04T09:45:00Z',
  },
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    merchantId: 'm-001',
    merchantName: 'Fresh Harvest Supermarket',
    customerName: 'Anura Kumara',
    orderId: 'ord-901',
    amount: 3840,
    status: 'paid',
    dueDate: '2026-09-10',
    paidAt: '2026-09-04T08:30:00Z',
    notes: 'Paid via Card / Online Gateway',
    createdAt: '2026-09-04T08:30:00Z',
  },
  {
    id: 'inv-102',
    merchantId: 'm-002',
    merchantName: 'Green Leaf Organic Store',
    customerName: 'Sujatha Alwis',
    orderId: 'ord-902',
    amount: 2260,
    status: 'pending',
    dueDate: '2026-09-05',
    notes: 'Bank Transfer Slip Uploaded (Awaiting Verification)',
    createdAt: '2026-09-04T09:05:00Z',
  },
  {
    id: 'inv-103',
    merchantId: 'm-001',
    merchantName: 'Fresh Harvest Supermarket',
    customerName: 'Raveen Fernando',
    orderId: 'ord-903',
    amount: 1440,
    status: 'pending',
    dueDate: '2026-09-06',
    notes: 'Awaiting Order Confirmation',
    createdAt: '2026-09-04T09:45:00Z',
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c-01',
    name: 'Anura Kumara',
    mobile: '+94 77 998 1122',
    email: 'anura.k@gmail.com',
    address: '24/B, Flower Road, Colombo 07',
    totalOrders: 14,
    totalSpent: 42800,
    createdAt: '2026-08-01T12:00:00Z',
  },
  {
    id: 'c-02',
    name: 'Sujatha Alwis',
    mobile: '+94 71 445 6677',
    email: 'sujatha.alwis@yahoo.com',
    address: '15/3 Templers Road, Mount Lavinia',
    totalOrders: 8,
    totalSpent: 19500,
    createdAt: '2026-08-10T14:30:00Z',
  },
  {
    id: 'c-03',
    name: 'Raveen Fernando',
    mobile: '+94 76 112 3344',
    email: 'raveen.f@outlook.com',
    address: '88 Negombo Road, Wattala',
    totalOrders: 3,
    totalSpent: 6200,
    createdAt: '2026-08-28T09:10:00Z',
  },
];

class AdminApiService {
  private users: UserAccount[] = INITIAL_USERS;
  private payments: PaymentTransaction[] = INITIAL_PAYMENTS;
  private merchants: Merchant[] = INITIAL_MERCHANTS;
  private riders: Rider[] = INITIAL_RIDERS;
  private products: Product[] = INITIAL_PRODUCTS;
  private orders: Order[] = INITIAL_ORDERS;
  private invoices: Invoice[] = INITIAL_INVOICES;
  private customers: Customer[] = INITIAL_CUSTOMERS;

  // ─── Stats ───────────────────────────────────────────────
  async getStats(): Promise<SystemStats> {
    const [orders, merchants, riders, users, payments] = await Promise.all([
      this.getOrders().catch(() => this.orders),
      this.getMerchants().catch(() => this.merchants),
      this.getRiders().catch(() => this.riders),
      this.getUsers().catch(() => this.users),
      this.getPayments().catch(() => this.payments),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);

    const activeRiders = riders.filter(
      (r) => r.status === 'AVAILABLE' || r.status === 'BUSY'
    ).length;

    const pendingApprovals =
      merchants.filter((m) => m.status === 'PENDING_APPROVAL').length +
      riders.filter((r) => !r.isApproved).length +
      users.filter((u) => u.status === 'PENDING').length;

    const pendingPaymentsCount = payments.filter(
      (p) => p.status === 'PENDING_VERIFICATION'
    ).length;

    return {
      totalRevenue: totalRevenue > 0 ? totalRevenue : 924500,
      totalOrders: orders.length,
      totalMerchants: merchants.length,
      activeRiders,
      pendingApprovals,
      pendingPaymentsCount,
      totalUsers: users.length,
      todayOrders: orders.length,
      monthlyGrowth: 18.4,
    };
  }

  // ─── Admin Authentication ────────────────────────────────
  async adminLogin(
    email: string,
    password?: string
  ): Promise<{ accessToken: string; user: UserAccount }> {
    const res = await fetch(`${API_BASE_URL}/auth/admin-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Sign in failed' }));
      throw new Error(err.message || 'Failed to sign in as Administrator');
    }

    const data = await res.json();
    localStorage.setItem('yaalu_admin_token', data.accessToken);
    localStorage.setItem('yaalu_admin_user', JSON.stringify(data.user));
    return data;
  }

  getStoredAdmin(): UserAccount | null {
    try {
      const u = localStorage.getItem('yaalu_admin_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('yaalu_admin_token');
    localStorage.removeItem('yaalu_admin_user');
  }

  // ─── User Accounts Management (CRUD & Roles) ─────────────
  async getUsers(role?: string): Promise<UserAccount[]> {
    try {
      const url = role && role !== 'ALL' ? `${API_BASE_URL}/users?role=${role}` : `${API_BASE_URL}/users`;
      const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) {
          this.users = live;
          return live;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch live users, using local cache', e);
    }
    return [...this.users];
  }

  async createUser(data: Partial<UserAccount>): Promise<UserAccount> {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const live = await res.json();
        this.users.unshift(live);
        return live;
      }
    } catch (e) {
      console.warn('Failed to post user to backend', e);
    }

    const newUser: UserAccount = {
      id: `u-${Date.now()}`,
      email: data.email || `user-${Date.now()}@yaalu.lk`,
      fullName: data.fullName || 'New Yaalu User',
      phone: data.phone || '+94 77 000 0000',
      role: data.role || 'CUSTOMER',
      status: data.status || 'ACTIVE',
      avatarUrl:
        data.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      customerProfile: data.customerProfile,
      shopProfile: data.shopProfile,
      riderProfile: data.riderProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newUser.role === 'SHOP' && newUser.shopProfile) {
      const newShop: Merchant = {
        id: `m-${Date.now()}`,
        userId: newUser.id,
        shopName: newUser.shopProfile.shopName || newUser.fullName,
        ownerName: newUser.fullName,
        ownerEmail: newUser.email,
        ownerPhone: newUser.phone,
        businessType: newUser.shopProfile.businessType || 'General Retail',
        shopAddress: newUser.shopProfile.shopAddress || '',
        registrationNo: newUser.shopProfile.registrationNo || '',
        status: newUser.status === 'ACTIVE' ? 'ACTIVE' : 'PENDING_APPROVAL',
        isVerified: newUser.status === 'ACTIVE',
        totalProducts: 0,
        totalOrders: 0,
        revenue: 0,
        createdAt: new Date().toISOString(),
      };
      this.merchants.unshift(newShop);
    } else if (newUser.role === 'RIDER' && newUser.riderProfile) {
      const newRider: Rider = {
        id: `r-${Date.now()}`,
        userId: newUser.id,
        fullName: newUser.fullName,
        phone: newUser.phone || '',
        email: newUser.email,
        vehicleType: (newUser.riderProfile.vehicleType as any) || 'MOTORBIKE',
        vehicleNumber: newUser.riderProfile.vehicleNumber || 'WP XXX-0000',
        licenseNumber: newUser.riderProfile.licenseNumber || 'B-000000',
        status: newUser.status === 'ACTIVE' ? 'AVAILABLE' : 'PENDING',
        isApproved: newUser.status === 'ACTIVE',
        deliveriesCompleted: 0,
        rating: 5.0,
        createdAt: new Date().toISOString(),
      };
      this.riders.unshift(newRider);
    }

    this.users.unshift(newUser);
    return newUser;
  }

  async updateUser(id: string, data: Partial<UserAccount>): Promise<UserAccount> {
    try {
      const res = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const live = await res.json();
        const idx = this.users.findIndex((u) => u.id === id);
        if (idx !== -1) this.users[idx] = live;
        return live;
      }
    } catch (e) {
      console.warn('Failed to update user on backend', e);
    }

    const user = this.users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    Object.assign(user, data, { updatedAt: new Date().toISOString() });
    return { ...user };
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete user on backend', e);
    }
    this.users = this.users.filter((u) => u.id !== id);
    return true;
  }

  // ─── Payment Transactions & Verification ──────────────────
  async getPayments(): Promise<PaymentTransaction[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/payments`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) {
          this.payments = live;
          return live;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch live payments', e);
    }
    return [...this.payments];
  }

  async verifyPayment(
    id: string,
    status: 'VERIFIED' | 'REJECTED',
    rejectionReason?: string
  ): Promise<PaymentTransaction> {
    try {
      const res = await fetch(`${API_BASE_URL}/payments/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason }),
      });
      if (res.ok) {
        const live = await res.json();
        const idx = this.payments.findIndex((p) => p.id === id);
        if (idx !== -1) this.payments[idx] = { ...this.payments[idx], ...live };
        return this.payments[idx] || live;
      }
    } catch (e) {
      console.warn('Failed to verify payment on backend', e);
    }

    const payment = this.payments.find((p) => p.id === id);
    if (!payment) throw new Error('Payment not found');

    payment.status = status;
    payment.verifiedBy = 'Super Administrator';
    payment.verifiedAt = new Date().toISOString();
    if (rejectionReason) payment.rejectionReason = rejectionReason;

    // Sync associated invoice & order if verified
    if (status === 'VERIFIED') {
      if (payment.invoiceId) {
        const inv = this.invoices.find((i) => i.id === payment.invoiceId);
        if (inv) {
          inv.status = 'paid';
          inv.paidAt = new Date().toISOString();
        }
      }
      if (payment.orderId) {
        const ord = this.orders.find((o) => o.id === payment.orderId);
        if (ord && ord.status === 'pending') {
          ord.status = 'confirmed';
        }
      }
    }

    return { ...payment };
  }

  // ─── Merchants ───────────────────────────────────────────
  async getMerchants(): Promise<Merchant[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/merchants`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) {
          this.merchants = live;
          return live;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch live merchants', e);
    }
    return [...this.merchants];
  }

  async verifyMerchant(id: string, isVerified: boolean): Promise<Merchant> {
    try {
      const res = await fetch(`${API_BASE_URL}/merchants/${id}/verify`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVerified }),
      });
      if (res.ok) {
        const live = await res.json();
        const idx = this.merchants.findIndex((m) => m.id === id);
        if (idx !== -1) this.merchants[idx] = { ...this.merchants[idx], ...live, isVerified, status: isVerified ? 'ACTIVE' : 'SUSPENDED' };
        return this.merchants[idx];
      }
    } catch (e) {
      console.warn('Failed to verify merchant on backend', e);
    }

    const m = this.merchants.find((item) => item.id === id);
    if (!m) throw new Error('Merchant not found');
    m.isVerified = isVerified;
    m.status = isVerified ? 'ACTIVE' : 'SUSPENDED';
    return { ...m };
  }

  async updateMerchantStatus(
    id: string,
    status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'
  ): Promise<Merchant> {
    const m = this.merchants.find((item) => item.id === id);
    if (!m) throw new Error('Merchant not found');
    m.status = status;
    return { ...m };
  }

  // ─── Riders ──────────────────────────────────────────────
  async getRiders(): Promise<Rider[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/riders`, {
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) {
          this.riders = live;
          return live;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch live riders', e);
    }
    return [...this.riders];
  }

  async updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
    try {
      const res = await fetch(`${API_BASE_URL}/riders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const live = await res.json();
        const idx = this.riders.findIndex((r) => r.id === id);
        if (idx !== -1) this.riders[idx] = { ...this.riders[idx], status };
        return this.riders[idx] || live;
      }
    } catch (e) {
      console.warn('Failed to update rider status on backend', e);
    }

    const r = this.riders.find((item) => item.id === id);
    if (!r) throw new Error('Rider not found');
    r.status = status;
    if (status === 'AVAILABLE' || status === 'BUSY') {
      r.isApproved = true;
    }
    return { ...r };
  }

  async approveRider(id: string, isApproved: boolean): Promise<Rider> {
    try {
      const res = await fetch(`${API_BASE_URL}/riders/${id}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        const idx = this.riders.findIndex((r) => r.id === id);
        if (idx !== -1) {
          this.riders[idx].isApproved = isApproved;
          this.riders[idx].status = isApproved ? 'AVAILABLE' : 'SUSPENDED';
          return this.riders[idx];
        }
      }
    } catch (e) {
      console.warn('Failed to approve rider on backend', e);
    }

    const r = this.riders.find((item) => item.id === id);
    if (!r) throw new Error('Rider not found');
    r.isApproved = isApproved;
    r.status = isApproved ? 'AVAILABLE' : 'SUSPENDED';
    return { ...r };
  }

  // ─── Products ────────────────────────────────────────────
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.products];
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const live = await res.json();
        this.products.unshift(live);
        return live;
      }
    } catch {}

    const newProd: Product = {
      id: `p-${Date.now()}`,
      merchantId: data.merchantId || 'm-001',
      merchantName: data.merchantName || 'Fresh Harvest Supermarket',
      name: data.name || 'Untitled Product',
      sku: data.sku || `SKU-${Date.now().toString().slice(-4)}`,
      price: data.price || 0,
      costPrice: data.costPrice || (data.price ? data.price * 0.8 : 0),
      unit: data.unit || 'kg',
      stock: data.stock || 0,
      lowStockThreshold: data.lowStockThreshold || 10,
      category: data.category || 'General',
      imageUrl: data.imageUrl,
      description: data.description,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.products.unshift(newProd);
    return newProd;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const live = await res.json();
        const idx = this.products.findIndex((p) => p.id === id);
        if (idx !== -1) this.products[idx] = live;
        return live;
      }
    } catch {}

    const prod = this.products.find((p) => p.id === id);
    if (!prod) throw new Error('Product not found');
    Object.assign(prod, data, { updatedAt: new Date().toISOString() });
    return { ...prod };
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
    } catch {}
    this.products = this.products.filter((p) => p.id !== id);
    return true;
  }

  // ─── Orders ──────────────────────────────────────────────
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.orders];
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    try {
      const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const live = await res.json();
        const idx = this.orders.findIndex((o) => o.id === id);
        if (idx !== -1) this.orders[idx] = live;
        return live;
      }
    } catch {}

    const ord = this.orders.find((o) => o.id === id);
    if (!ord) throw new Error('Order not found');
    ord.status = status;
    ord.updatedAt = new Date().toISOString();
    return { ...ord };
  }

  // ─── Invoices ────────────────────────────────────────────
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.invoices];
  }

  async markInvoicePaid(id: string): Promise<Invoice> {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/${id}/pay`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const live = await res.json();
        return live;
      }
    } catch {}

    const inv = this.invoices.find((i) => i.id === id);
    if (!inv) throw new Error('Invoice not found');
    inv.status = 'paid';
    inv.paidAt = new Date().toISOString();
    return { ...inv };
  }

  // ─── Customers ───────────────────────────────────────────
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/customers`, {
        signal: AbortSignal.timeout(2000),
      });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.customers];
  }
}

export const adminApi = new AdminApiService();
