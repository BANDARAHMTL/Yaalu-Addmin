import { Customer, Invoice, Merchant, Order, Product, Rider, SystemStats } from '../types';

const API_BASE_URL = 'http://localhost:3001';

// Initial Mock / Seed Data for instant out-of-the-box rich presentation
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
    price: 320,
    unit: 'kg',
    stock: 250,
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
    price: 480,
    unit: 'kg',
    stock: 85,
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
    price: 260,
    unit: 'kg',
    stock: 40,
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
    price: 750,
    unit: 'pack (100g)',
    stock: 65,
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
    price: 490,
    unit: 'pack',
    stock: 120,
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
    paidAt: '2026-09-04T09:15:00Z',
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
    notes: 'Cash on Delivery (Pending Rider Collection)',
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

// Local state caching with persistent memory fallback
class AdminApiService {
  private merchants: Merchant[] = INITIAL_MERCHANTS;
  private riders: Rider[] = INITIAL_RIDERS;
  private products: Product[] = INITIAL_PRODUCTS;
  private orders: Order[] = INITIAL_ORDERS;
  private invoices: Invoice[] = INITIAL_INVOICES;
  private customers: Customer[] = INITIAL_CUSTOMERS;

  // ─── Stats ───────────────────────────────────────────────
  async getStats(): Promise<SystemStats> {
    const totalRevenue = this.orders
      .filter((o) => o.status === 'delivered')
      .reduce((sum, o) => sum + o.totalAmount, 0) + 920000;

    const activeRiders = this.riders.filter((r) => r.status === 'AVAILABLE' || r.status === 'BUSY').length;
    const pendingApprovals =
      this.merchants.filter((m) => m.status === 'PENDING_APPROVAL').length +
      this.riders.filter((r) => !r.isApproved).length;

    return {
      totalRevenue,
      totalOrders: this.orders.length + 590,
      totalMerchants: this.merchants.length,
      activeRiders,
      pendingApprovals,
      todayOrders: this.orders.length,
      monthlyGrowth: 18.4,
    };
  }

  // ─── Merchants ───────────────────────────────────────────
  async getMerchants(): Promise<Merchant[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/merchants`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.merchants];
  }

  async verifyMerchant(id: string, isVerified: boolean): Promise<Merchant> {
    const m = this.merchants.find((item) => item.id === id);
    if (!m) throw new Error('Merchant not found');
    m.isVerified = isVerified;
    m.status = isVerified ? 'ACTIVE' : 'SUSPENDED';
    return { ...m };
  }

  async updateMerchantStatus(id: string, status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'): Promise<Merchant> {
    const m = this.merchants.find((item) => item.id === id);
    if (!m) throw new Error('Merchant not found');
    m.status = status;
    return { ...m };
  }

  // ─── Riders ──────────────────────────────────────────────
  async getRiders(): Promise<Rider[]> {
    return [...this.riders];
  }

  async updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
    const r = this.riders.find((item) => item.id === id);
    if (!r) throw new Error('Rider not found');
    r.status = status;
    if (status === 'AVAILABLE' || status === 'BUSY') {
      r.isApproved = true;
    }
    return { ...r };
  }

  async approveRider(id: string, isApproved: boolean): Promise<Rider> {
    const r = this.riders.find((item) => item.id === id);
    if (!r) throw new Error('Rider not found');
    r.isApproved = isApproved;
    r.status = isApproved ? 'AVAILABLE' : 'SUSPENDED';
    return { ...r };
  }

  // ─── Products ────────────────────────────────────────────
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, { signal: AbortSignal.timeout(2000) });
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
      price: data.price || 0,
      unit: data.unit || 'kg',
      stock: data.stock || 0,
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
      const res = await fetch(`${API_BASE_URL}/orders`, { signal: AbortSignal.timeout(2000) });
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
      const res = await fetch(`${API_BASE_URL}/invoices`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.invoices];
  }

  async markInvoicePaid(id: string): Promise<Invoice> {
    try {
      const res = await fetch(`${API_BASE_URL}/invoices/${id}/pay`, { method: 'PATCH' });
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
      const res = await fetch(`${API_BASE_URL}/customers`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const live = await res.json();
        if (Array.isArray(live) && live.length > 0) return live;
      }
    } catch {}
    return [...this.customers];
  }
}

export const adminApi = new AdminApiService();
