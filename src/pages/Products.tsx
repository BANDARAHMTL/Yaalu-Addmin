import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  UploadCloud,
  Check,
  Image as ImageIcon,
  Eye,
  Tag,
  AlertTriangle,
  Store,
  DollarSign,
  Layers,
} from 'lucide-react';
import { Modal } from '../components/Modal';
import { uploadToCloudinary } from '../services/cloudinary';
import { Merchant, Product } from '../types';

interface ProductsProps {
  products: Product[];
  merchants: Merchant[];
  onCreateProduct: (data: Partial<Product>) => Promise<Product>;
  onUpdateProduct: (id: string, data: Partial<Product>) => Promise<Product>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  searchTerm: string;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  merchants,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  searchTerm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState('10');
  const [category, setCategory] = useState('Grocery');
  const [merchantId, setMerchantId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    setPrice('');
    setCostPrice('');
    setUnit('kg');
    setStock('50');
    setLowStockThreshold('15');
    setCategory('Grocery');
    setMerchantId(merchants[0]?.id || 'm-001');
    setDescription('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setSku(p.sku || '');
    setPrice(p.price.toString());
    setCostPrice(p.costPrice?.toString() || '');
    setUnit(p.unit);
    setStock(p.stock.toString());
    setLowStockThreshold(p.lowStockThreshold?.toString() || '10');
    setCategory(p.category || 'Grocery');
    setMerchantId(p.merchantId);
    setDescription(p.description || '');
    setImageUrl(p.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const url = await uploadToCloudinary(file, 'yaalu_products');
      setImageUrl(url);
    } catch (err: any) {
      alert(`Cloudinary upload failed: ${err?.message || 'Error'}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;

    try {
      setIsSaving(true);
      const selectedMerchant = merchants.find((m) => m.id === merchantId);

      const payload: Partial<Product> = {
        name,
        sku: sku || undefined,
        price: parseFloat(price),
        costPrice: costPrice ? parseFloat(costPrice) : undefined,
        unit,
        stock: parseInt(stock) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 10,
        category,
        merchantId: merchantId || 'm-001',
        merchantName: selectedMerchant?.shopName || 'Fresh Harvest Supermarket',
        description,
        imageUrl: imageUrl || undefined,
        isActive: true,
      };

      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onCreateProduct(payload);
      }
      setIsModalOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickStockUpdate = async (product: Product, newStock: number) => {
    if (newStock < 0) return;
    const updated = await onUpdateProduct(product.id, { stock: newStock });
    if (inspectingProduct?.id === product.id) {
      setInspectingProduct(updated);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.merchantName && p.merchantName.toLowerCase().includes(term)) ||
      (p.sku && p.sku.toLowerCase().includes(term));
    return matchesCat && matchesSearch;
  });

  const allCategories = ['ALL', ...Array.from(new Set(products.map((p) => p.category || 'General')))];

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Global Product Inventory & Details
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Inspect product details, margins, stock thresholds, and Cloudinary CDN assets
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className="btn btn-sm"
              style={{
                background: categoryFilter === cat ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.06)',
                color: categoryFilter === cat ? '#0F172A' : 'var(--text-secondary)',
                fontWeight: 700,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {filteredProducts.length} items cataloged
        </div>
      </div>

      {/* Product List Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product & SKU</th>
              <th>Partner Merchant</th>
              <th>Category</th>
              <th>Selling Price</th>
              <th>Stock Status</th>
              <th>Cloud CDN</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No products found.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const isLowStock = p.stock <= (p.lowStockThreshold || 15);
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={p.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100'}
                          alt={p.name}
                          style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                            {p.sku || 'SKU-0000'} • Per {p.unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {p.merchantName || 'Central Store'}
                    </td>
                    <td>
                      <span
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {p.category || 'General'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                      LKR {p.price.toLocaleString()}
                    </td>
                    <td>
                      {isLowStock ? (
                        <span className="flex items-center gap-1" style={{ color: 'var(--color-warning)', fontWeight: 700, fontSize: 13 }}>
                          <AlertTriangle size={13} /> {p.stock} (Low Stock)
                        </span>
                      ) : (
                        <span style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: 13 }}>
                          {p.stock} in stock
                        </span>
                      )}
                    </td>
                    <td>
                      {p.imageUrl?.includes('cloudinary') ? (
                        <span className="badge badge-success" style={{ fontSize: 11 }}>
                          Cloudinary CDN
                        </span>
                      ) : (
                        <span className="badge badge-info" style={{ fontSize: 11 }}>
                          Web Image
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => setInspectingProduct(p)}
                          title="View Full Product Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => openEditModal(p)}
                          title="Edit Product"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-secondary btn-icon"
                          onClick={() => {
                            if (confirm(`Delete ${p.name}?`)) onDeleteProduct(p.id);
                          }}
                          title="Delete Product"
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect Product Details Modal */}
      {inspectingProduct && (
        <Modal
          isOpen={!!inspectingProduct}
          onClose={() => setInspectingProduct(null)}
          title={`Product Details: ${inspectingProduct.name}`}
          maxWidth={640}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Image Preview & Core Attributes */}
            <div className="flex gap-4 card" style={{ padding: 16 }}>
              <img
                src={
                  inspectingProduct.imageUrl ||
                  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
                }
                alt={inspectingProduct.name}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 12,
                  objectFit: 'cover',
                  border: '2px solid var(--border-dark)',
                }}
              />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#FFFFFF' }}>
                    {inspectingProduct.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    SKU Code: <code style={{ color: 'var(--color-primary)' }}>{inspectingProduct.sku || 'N/A'}</code>
                  </div>
                  <div className="flex items-center gap-2" style={{ marginTop: 8 }}>
                    <span className="badge badge-purple">{inspectingProduct.category || 'Grocery'}</span>
                    <span className="badge badge-success">Unit: {inspectingProduct.unit}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2" style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  <Store size={14} color="var(--color-primary)" />
                  Merchant: <strong>{inspectingProduct.merchantName || 'Central Store'}</strong>
                </div>
              </div>
            </div>

            {/* Financials & Profit Margin Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Selling Price</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-primary)', marginTop: 2 }}>
                  LKR {inspectingProduct.price.toLocaleString()}
                </div>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>Cost Price</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-secondary)', marginTop: 2 }}>
                  LKR {(inspectingProduct.costPrice || inspectingProduct.price * 0.8).toLocaleString()}
                </div>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <div style={{ fontSize: 11.5, color: 'var(--color-success)' }}>Estimated Margin</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-success)', marginTop: 2 }}>
                  +
                  {(
                    ((inspectingProduct.price - (inspectingProduct.costPrice || inspectingProduct.price * 0.8)) /
                      inspectingProduct.price) *
                    100
                  ).toFixed(1)}
                  %
                </div>
              </div>
            </div>

            {/* Live Stock Level Adjuster */}
            <div className="card" style={{ padding: 16 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>
                  Current Inventory In-Stock:
                </span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--color-primary)' }}>
                  {inspectingProduct.stock} {inspectingProduct.unit}s
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleQuickStockUpdate(inspectingProduct, inspectingProduct.stock - 10)}
                >
                  -10 Units
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleQuickStockUpdate(inspectingProduct, inspectingProduct.stock - 1)}
                >
                  -1
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleQuickStockUpdate(inspectingProduct, inspectingProduct.stock + 1)}
                >
                  +1
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleQuickStockUpdate(inspectingProduct, inspectingProduct.stock + 10)}
                >
                  +10 Units
                </button>
              </div>
            </div>

            {/* Description */}
            {inspectingProduct.description && (
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {inspectingProduct.description}
              </div>
            )}

            <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  const p = inspectingProduct;
                  setInspectingProduct(null);
                  openEditModal(p);
                }}
              >
                <Edit2 size={14} /> Edit Full Product
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setInspectingProduct(null)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        maxWidth={620}
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Cloudinary Image Picker */}
          <div className="input-group">
            <label className="input-label">Product Image (Cloudinary CDN)</label>
            <div className="flex items-center gap-4">
              {imageUrl ? (
                <div style={{ position: 'relative' }}>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: 12,
                      objectFit: 'cover',
                      border: '2px solid var(--color-primary)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      background: 'var(--color-success)',
                      borderRadius: '50%',
                      padding: 2,
                    }}
                  >
                    <Check size={12} color="#FFFFFF" />
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px dashed var(--border-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ImageIcon size={28} color="var(--text-muted)" />
                </div>
              )}

              <div style={{ flex: 1 }}>
                <label
                  className="btn btn-secondary btn-sm"
                  style={{ cursor: uploadingImage ? 'not-allowed' : 'pointer', display: 'inline-flex' }}
                >
                  <UploadCloud size={16} />
                  {uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Image to Cloudinary'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                </label>
                <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6 }}>
                  Directly saved to Cloudinary cloud: <strong>yaalu</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Product Title *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g. Organic Cavendish Bananas"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">SKU / Barcode</label>
              <input
                type="text"
                className="input-field"
                placeholder="SKU-8821"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Selling Price (LKR) *</label>
              <input
                type="number"
                required
                className="input-field"
                placeholder="450"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Cost / Wholesale Price (LKR)</label>
              <input
                type="number"
                className="input-field"
                placeholder="350"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="input-group">
              <label className="input-label">Unit</label>
              <input
                type="text"
                className="input-field"
                placeholder="kg, pack"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Stock Qty</label>
              <input
                type="number"
                className="input-field"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Low Stock Alert</label>
              <input
                type="number"
                className="input-field"
                value={lowStockThreshold}
                onChange={(e) => setLowStockThreshold(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Category</label>
              <select
                className="select-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Grocery">Grocery</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Fruits">Fruits</option>
                <option value="Rice & Grains">Rice & Grains</option>
                <option value="Spices">Spices</option>
                <option value="Dairy">Dairy</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Assign Merchant Shop</label>
              <select
                className="select-field"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
              >
                {merchants.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.shopName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="textarea-field"
              rows={2}
              placeholder="Product details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: 12 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
