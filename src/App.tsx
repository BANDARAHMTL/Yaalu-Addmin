import React, { useState, useEffect } from 'react';
import { Sidebar, TabType } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { Merchants } from './pages/Merchants';
import { Riders } from './pages/Riders';
import { Products } from './pages/Products';
import { Orders } from './pages/Orders';
import { Invoices } from './pages/Invoices';
import { Customers } from './pages/Customers';
import { Settings } from './pages/Settings';
import { adminApi } from './services/api';
import { Customer, Invoice, Merchant, Order, Product, Rider, SystemStats } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Data States
  const [stats, setStats] = useState<SystemStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalMerchants: 0,
    activeRiders: 0,
    pendingApprovals: 0,
    todayOrders: 0,
    monthlyGrowth: 0,
  });
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  const loadAllData = async () => {
    try {
      setIsRefreshing(true);
      const [s, m, r, p, o, inv, c] = await Promise.all([
        adminApi.getStats(),
        adminApi.getMerchants(),
        adminApi.getRiders(),
        adminApi.getProducts(),
        adminApi.getOrders(),
        adminApi.getInvoices(),
        adminApi.getCustomers(),
      ]);
      setStats(s);
      setMerchants(m);
      setRiders(r);
      setProducts(p);
      setOrders(o);
      setInvoices(inv);
      setCustomers(c);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleVerifyMerchant = async (id: string, isVerified: boolean) => {
    const updated = await adminApi.verifyMerchant(id, isVerified);
    setMerchants((prev) => prev.map((m) => (m.id === id ? updated : m)));
    const updatedStats = await adminApi.getStats();
    setStats(updatedStats);
  };

  const handleUpdateMerchantStatus = async (id: string, status: Merchant['status']) => {
    const updated = await adminApi.updateMerchantStatus(id, status);
    setMerchants((prev) => prev.map((m) => (m.id === id ? updated : m)));
    const updatedStats = await adminApi.getStats();
    setStats(updatedStats);
  };

  const handleApproveRider = async (id: string, isApproved: boolean) => {
    const updated = await adminApi.approveRider(id, isApproved);
    setRiders((prev) => prev.map((r) => (r.id === id ? updated : r)));
    const updatedStats = await adminApi.getStats();
    setStats(updatedStats);
  };

  const handleUpdateRiderStatus = async (id: string, status: Rider['status']) => {
    const updated = await adminApi.updateRiderStatus(id, status);
    setRiders((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleCreateProduct = async (data: Partial<Product>) => {
    const created = await adminApi.createProduct(data);
    setProducts((prev) => [created, ...prev]);
    return created;
  };

  const handleUpdateProduct = async (id: string, data: Partial<Product>) => {
    const updated = await adminApi.updateProduct(id, data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    return updated;
  };

  const handleDeleteProduct = async (id: string) => {
    const ok = await adminApi.deleteProduct(id);
    if (ok) setProducts((prev) => prev.filter((p) => p.id !== id));
    return ok;
  };

  const handleUpdateOrderStatus = async (id: string, status: Order['status']) => {
    const updated = await adminApi.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
    return updated;
  };

  const handleMarkInvoicePaid = async (id: string) => {
    const updated = await adminApi.markInvoicePaid(id);
    setInvoices((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Executive Overview', subtitle: 'Platform analytics, live metrics and operations status' };
      case 'merchants':
        return { title: 'Partner Shops & Outlets', subtitle: 'Merchant onboarding, verification, and BR credentials' };
      case 'riders':
        return { title: 'Delivery Fleet & Riders', subtitle: 'Rider approvals, license verification, and active status' };
      case 'products':
        return { title: 'Global Product Catalog', subtitle: 'Inventory control, pricing, and Cloudinary asset management' };
      case 'orders':
        return { title: 'Customer Orders Stream', subtitle: 'Order processing, stage transitions, and deliveries' };
      case 'invoices':
        return { title: 'Invoices & Settlements', subtitle: 'Merchant billing, payment receipts, and collections' };
      case 'customers':
        return { title: 'Customer Base', subtitle: 'Shopper profiles, spend analytics, and communication' };
      case 'settings':
        return { title: 'System & Cloud Storage', subtitle: 'Cloudinary credentials, API diagnostics, and health' };
    }
  };

  const pageInfo = getPageTitle();

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingCount={stats.pendingApprovals}
      />

      {/* Main Workspace */}
      <div className="main-content">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadAllData}
          isRefreshing={isRefreshing}
        />

        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            orders={orders}
            merchants={merchants}
            riders={riders}
            products={products}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'merchants' && (
          <Merchants
            merchants={merchants}
            onVerify={handleVerifyMerchant}
            onUpdateStatus={handleUpdateMerchantStatus}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'riders' && (
          <Riders
            riders={riders}
            onApprove={handleApproveRider}
            onUpdateStatus={handleUpdateRiderStatus}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'products' && (
          <Products
            products={products}
            merchants={merchants}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'orders' && (
          <Orders
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'invoices' && (
          <Invoices
            invoices={invoices}
            onMarkPaid={handleMarkInvoicePaid}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'customers' && (
          <Customers
            customers={customers}
            searchTerm={searchTerm}
          />
        )}

        {activeTab === 'settings' && <Settings />}
      </div>
    </div>
  );
}

export default App;
