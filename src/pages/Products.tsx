import React, { useState } from 'react';
import { Plus, Edit2, Trash2, UploadCloud, Check, Image as ImageIcon } from 'lucide-react';
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

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Grocery');
  const [merchantId, setMerchantId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setUnit('kg');
    setStock('50');
    setCategory('Grocery');
    setMerchantId(merchants[0]?.id || 'm-001');
    setDescription('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price.toString());
    setUnit(p.unit);
    setStock(p.stock.toString());
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
        price: parseFloat(price),
        unit,
        stock: parseInt(stock) || 0,
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

  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      (p.category && p.category.toLowerCase().includes(term)) ||
      (p.merchantName && p.merchantName.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            Global Product Inventory
          </h2>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
            Manage catalog items and direct Cloudinary image assets across all merchants
          </p>
        </div>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={16} /> Add New Product
        </button>
      </div>

      {/* Product List Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Product Details</th>
              <th>Partner Merchant</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Available Stock</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No products found. Click "Add New Product" to create one.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
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
                          Per {p.unit}
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
                    <span
                      style={{
                        fontWeight: 700,
                        color: p.stock > 20 ? 'var(--color-success)' : 'var(--color-warning)',
                      }}
                    >
                      {p.stock} in stock
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-success">Active</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
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
              ))
            )}
          </tbody>
        </table>
      </div>

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
                    style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: '2px solid var(--color-primary)' }}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Price (LKR) *</label>
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
              <label className="input-label">Unit of Sale</label>
              <input
                type="text"
                className="input-field"
                placeholder="kg, pack, bottle"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="input-label">Stock Quantity</label>
              <input
                type="number"
                className="input-field"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
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

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="textarea-field"
              rows={2}
              placeholder="Fresh organic produce details..."
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
