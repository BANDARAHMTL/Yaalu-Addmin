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
  FareSetting,
  FareCalculationResult,
} from '../types';

const API_BASE_URL = 'http://localhost:3001';

class AdminApiService {

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

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('yaalu_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // ─── Stats ───────────────────────────────────────────────
  async getStats(): Promise<SystemStats> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Failed to fetch stats from backend', e);
    }
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalMerchants: 0,
      activeRiders: 0,
      pendingApprovals: 0,
      pendingPaymentsCount: 0,
      totalUsers: 0,
      todayOrders: 0,
      monthlyGrowth: 0,
    };
  }

  // ─── User Accounts Management (CRUD & Roles) ─────────────
  async getUsers(role?: string): Promise<UserAccount[]> {
    try {
      const url = role && role !== 'ALL'
        ? `${API_BASE_URL}/admin/users?role=${role}`
        : `${API_BASE_URL}/admin/users`;
      const res = await fetch(url, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch users from backend', e);
    }
    return [];
  }

  async createUser(data: Partial<UserAccount>): Promise<UserAccount> {
    const res = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create user' }));
      throw new Error(err.message);
    }
    return await res.json();
  }

  async updateUser(id: string, data: Partial<UserAccount>): Promise<UserAccount> {
    const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update user' }));
      throw new Error(err.message);
    }
    return await res.json();
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return res.ok;
    } catch (e) {
      console.warn('Failed to delete user', e);
      return false;
    }
  }

  // ─── Payment Transactions & Verification ──────────────────
  async getPayments(): Promise<PaymentTransaction[]> {
    // Payments endpoint not yet implemented on backend
    return [];
  }

  async verifyPayment(
    id: string,
    status: 'VERIFIED' | 'REJECTED',
    rejectionReason?: string
  ): Promise<PaymentTransaction> {
    throw new Error('Payment verification not yet implemented on backend');
  }

  // ─── Merchants ───────────────────────────────────────────
  async getMerchants(): Promise<Merchant[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/merchants`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch merchants from backend', e);
    }
    return [];
  }

  async verifyMerchant(id: string, isVerified: boolean): Promise<Merchant> {
    const res = await fetch(`${API_BASE_URL}/admin/merchants/${id}/verify`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isVerified }),
    });
    if (!res.ok) throw new Error('Failed to verify merchant');
    return await res.json();
  }

  async updateMerchantStatus(
    id: string,
    status: 'ACTIVE' | 'PENDING_APPROVAL' | 'SUSPENDED'
  ): Promise<Merchant> {
    // Status update can be handled via verify for now
    return this.verifyMerchant(id, status === 'ACTIVE');
  }

  async updateMerchantBankDetails(
    id: string,
    data: {
      bankName?: string;
      accountName?: string;
      accountNo?: string;
      accountBranch?: string;
      cardLast4?: string;
      cardType?: string;
    }
  ): Promise<Merchant> {
    const res = await fetch(`${API_BASE_URL}/admin/merchants/${id}/bank`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update merchant bank details');
    return await res.json();
  }

  async updateMerchant(
    id: string,
    data: Partial<Merchant>
  ): Promise<Merchant> {
    const res = await fetch(`${API_BASE_URL}/admin/merchants/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update merchant profile');
    return await res.json();
  }

  // ─── Riders ──────────────────────────────────────────────
  async getRiders(): Promise<Rider[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/riders`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch riders from backend', e);
    }
    return [];
  }

  async updateRiderStatus(id: string, status: Rider['status']): Promise<Rider> {
    const res = await fetch(`${API_BASE_URL}/admin/riders/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update rider status');
    return await res.json();
  }

  async approveRider(id: string, isApproved: boolean): Promise<Rider> {
    const res = await fetch(`${API_BASE_URL}/admin/riders/${id}/approve`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ isApproved }),
    });
    if (!res.ok) throw new Error('Failed to approve rider');
    return await res.json();
  }

  async updateRiderBankDetails(
    id: string,
    data: {
      bankName?: string;
      accountName?: string;
      accountNo?: string;
      accountBranch?: string;
    }
  ): Promise<Rider> {
    const res = await fetch(`${API_BASE_URL}/admin/riders/${id}/bank`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update rider bank details');
    return await res.json();
  }

  // ─── Products ────────────────────────────────────────────
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch products from backend', e);
    }
    return [];
  }

  async createProduct(data: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to create product' }));
      throw new Error(err.message || 'Failed to create product');
    }
    return await res.json();
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const payload: Record<string, any> = {};
    if (data.name !== undefined) payload.name = data.name;
    if (data.price !== undefined) payload.price = parseFloat(data.price as any) || 0;
    if (data.unit !== undefined) payload.unit = data.unit;
    if (data.stock !== undefined) payload.stock = parseInt(data.stock as any) || 0;
    if (data.imageUrl !== undefined) payload.imageUrl = data.imageUrl;
    if (data.description !== undefined) payload.description = data.description;
    if (data.isActive !== undefined) payload.isActive = data.isActive;

    const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update product' }));
      throw new Error(err.message || 'Failed to update product');
    }
    return await res.json();
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ─── Orders ──────────────────────────────────────────────
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch orders from backend', e);
    }
    return [];
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return await res.json();
  }

  // ─── Invoices ────────────────────────────────────────────
  async getInvoices(): Promise<Invoice[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/invoices`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch invoices from backend', e);
    }
    return [];
  }

  async markInvoicePaid(id: string): Promise<Invoice> {
    const res = await fetch(`${API_BASE_URL}/admin/invoices/${id}/pay`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to mark invoice as paid');
    return await res.json();
  }

  // ─── Customers ───────────────────────────────────────────
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/customers`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch customers from backend', e);
    }
    return [];
  }

  async updateCustomer(
    id: string,
    data: Partial<Customer>
  ): Promise<Customer> {
    const res = await fetch(`${API_BASE_URL}/admin/customers/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update customer details');
    return await res.json();
  }

  async updateCustomerCardDetails(
    id: string,
    data: {
      cardLast4?: string;
      cardType?: string;
      billingAddress?: string;
    }
  ): Promise<Customer> {
    return this.updateCustomer(id, data);
  }

  // ─── Fare Calculation & Pricing Engine ────────────────────
  async getFareSettings(): Promise<FareSetting[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/fare-settings`, {
        headers: this.getAuthHeaders(),
        signal: AbortSignal.timeout(5000),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {
      console.warn('Failed to fetch fare settings from backend', e);
    }
    return [];
  }

  async updateFareSettings(data: Partial<FareSetting>): Promise<FareSetting> {
    const res = await fetch(`${API_BASE_URL}/admin/fare-settings`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Failed to update fare settings' }));
      throw new Error(err.message || 'Failed to update fare settings');
    }
    return await res.json();
  }

  async calculateTripFare(distanceKm: number, vehicleType = 'THREE_WHEEL'): Promise<FareSetting> {
    const res = await fetch(`${API_BASE_URL}/admin/fare-settings/calculate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ distanceKm, vehicleType }),
    });
    if (!res.ok) {
      throw new Error('Failed to calculate fare');
    }
    return await res.json();
  }
}

export const adminApi = new AdminApiService();
