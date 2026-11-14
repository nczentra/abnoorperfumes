import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';
import { Boxes, Plus, Minus, AlertTriangle, ArrowUpDown, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

export const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustModal, setAdjustModal] = useState(null); // { product, variant }
  const [adjustQty, setAdjustQty] = useState(5);
  const [adjustType, setAdjustType] = useState('STOCK_IN');
  const [adjustReason, setAdjustReason] = useState('New batch received from distillery');

  const loadData = async () => {
    setLoading(true);
    const [prods, logList] = await Promise.all([
      productService.getProducts(),
      inventoryService.getLogs(),
    ]);
    setProducts(prods);
    setLogs(logList);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    if (!adjustModal) return;

    const delta = adjustType === 'STOCK_IN' ? Math.abs(adjustQty) : -Math.abs(adjustQty);

    await productService.updateStock(adjustModal.product.id, adjustModal.variant.id, delta);
    await inventoryService.addLog({
      productId: adjustModal.product.id,
      productName: adjustModal.product.name,
      variantSize: adjustModal.variant.size,
      type: adjustType,
      quantity: delta,
      reason: adjustReason,
      staffName: 'Admin Vault Manager',
    });

    toast.success(`Inventory adjusted for ${adjustModal.product.name} (${adjustModal.variant.size}).`);
    setAdjustModal(null);
    loadData();
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="font-playfair text-2xl font-bold text-brand-emerald">
          Variant Inventory & Vault Management
        </h1>
        <p className="text-xs text-stone-500">
          Monitor stock levels by flacon volume and log stock movements.
        </p>
      </div>

      {/* Variant Stock Overview Table */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-playfair font-bold text-base text-brand-emerald">
            Current Stock Levels by Flacon Size
          </h3>
          <span className="text-xs text-stone-400">Variant-Level Granularity</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-[11px] font-bold uppercase tracking-wider text-stone-500">
              <tr>
                <th className="py-3 px-4">Fragrance</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Selling Price</th>
                <th className="py-3 px-4">Units in Vault</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.flatMap(product => 
                (product.variants || []).map(variant => (
                  <tr key={`${product.id}-${variant.id}`} className="hover:bg-stone-50/60 transition">
                    <td className="py-3 px-4 font-semibold text-brand-emerald">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-800">
                      {variant.size}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-500">
                      {variant.sku}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-700">
                      ₹{(variant.discountPrice || variant.sellingPrice).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 font-bold text-base">
                      {variant.stock}
                    </td>
                    <td className="py-3 px-4">
                      {variant.stock <= 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Out of Stock
                        </span>
                      ) : variant.stock <= (variant.lowStockThreshold || 5) ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          Low Stock Alert
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustModal({ product, variant });
                          setAdjustQty(5);
                          setAdjustType('STOCK_IN');
                        }}
                        className="px-3 py-1 bg-stone-100 hover:bg-brand-emerald hover:text-white rounded-lg text-[11px] font-semibold transition"
                      >
                        Adjust Stock
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movement Audit Log */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 shadow-sm space-y-4">
        <h3 className="font-playfair text-lg font-bold text-brand-emerald pb-2 border-b border-stone-100">
          Inventory Audit Log & Movements
        </h3>

        <div className="divide-y divide-stone-100 text-xs">
          {logs.slice(0, 10).map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between">
              <div>
                <strong className="text-stone-800 block">{log.productName} ({log.variantSize})</strong>
                <span className="text-stone-500 text-[11px]">Reason: {log.reason} • By {log.staffName}</span>
              </div>
              <div className="text-right">
                <span className={`font-bold font-mono ${log.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {log.quantity > 0 ? `+${log.quantity}` : log.quantity}
                </span>
                <span className="text-[10px] text-stone-400 block">{new Date(log.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-dark-forest/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-brand-gold/40 space-y-4 text-xs">
            <h3 className="font-playfair text-lg font-bold text-brand-emerald">
              Adjust Stock: {adjustModal.product.name} ({adjustModal.variant.size})
            </h3>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Adjustment Type</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option value="STOCK_IN">Stock In (Receive new distillation batch)</option>
                  <option value="STOCK_OUT">Stock Out (Manual deduction / sample)</option>
                  <option value="DAMAGED">Damaged / Broken in vault</option>
                  <option value="RETURN">Customer Return Restock</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Quantity of Flacons</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-bold uppercase mb-1">Audit Log Reason</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setAdjustModal(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-emerald text-brand-soft-gold rounded-xl font-bold uppercase"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
