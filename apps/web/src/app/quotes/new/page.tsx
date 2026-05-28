'use client';
import React, { useState } from 'react';
import { apiRequest } from '@/lib/api-client';
import { Product, QuoteItem } from '@producthubb/shared';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export default function NewQuotePage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState('');
  const [quoteNumber, setQuoteNumber] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [globalDiscountType, setGlobalDiscountType] = useState<'percentage' | 'flat'>('flat');
  const [globalDiscountValue, setGlobalDiscountValue] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const { data: products } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => apiRequest<Product[]>('/products'),
  });

  const addProduct = (product: Product) => {
    const existing = items.find(i => i.productId === product.sku);
    if (existing) {
      setItems(items.map(i => i.productId === product.sku ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, { productId: product.sku, quantity: 1, unitPrice: product.basePrice }]);
    }
  };

  const updateQuantity = (index: number, qty: number) => {
    const newItems = [...items];
    newItems[index].quantity = qty;
    setItems(newItems);
  };

  const updateItemDiscount = (index: number, field: 'discountType' | 'discountValue', value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeProduct = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totals = (() => {
    const subtotal = items.reduce((acc, item) => {
      const lineTotal = item.unitPrice * item.quantity;
      let itemDiscount = 0;
      if (item.discountType === 'percentage') {
        itemDiscount = lineTotal * (item.discountValue || 0) / 100;
      } else if (item.discountType === 'flat') {
        itemDiscount = item.discountValue || 0;
      }
      return acc + (lineTotal - itemDiscount);
    }, 0);

    let discountedSubtotal = subtotal;
    if (globalDiscountType === 'percentage') {
      discountedSubtotal = subtotal * (1 - (globalDiscountValue || 0) / 100);
    } else if (globalDiscountType === 'flat') {
      discountedSubtotal = subtotal - (globalDiscountValue || 0);
    }

    const tax = discountedSubtotal * 0.1;
    const total = Math.max(0, discountedSubtotal + tax);

    return { subtotal, discountedSubtotal, tax, total };
  })();

  const handleSave = async () => {
    if (!customerId || !quoteNumber) return alert('Please fill in Customer ID and Quote Number');
    setIsSaving(true);
    try {
      await apiRequest('/quotes', {
        method: 'POST',
        body: JSON.stringify({
          quoteNumber,
          customerId,
          status: 'Draft',
          items,
          globalDiscountType,
          globalDiscountValue,
          subtotal: totals.subtotal,
          tax: totals.tax,
          total: totals.total,
        }),
      });
      router.push('/quotes');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold">Create New Quote</h1>

        <div className="bg-white p-6 rounded-lg shadow border space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quote Number</label>
              <input
                className="w-full p-2 border rounded"
                value={quoteNumber}
                onChange={e => setQuoteNumber(e.target.value)}
                placeholder="Q-2026-001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Customer ID</label>
              <input
                className="w-full p-2 border rounded"
                value={customerId}
                onChange={e => setCustomerId(e.target.value)}
                placeholder="CUST-123"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr className="text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Qty</th>
                <th className="p-4 font-semibold">Discount</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx} className="border-b text-sm">
                  <td className="p-4">{item.productId}</td>
                  <td className="p-4">${item.unitPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <input
                      type="number"
                      className="w-16 p-1 border rounded text-center"
                      value={item.quantity}
                      onChange={e => updateQuantity(idx, parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <select
                        className="p-1 border rounded text-xs"
                        value={item.discountType || 'flat'}
                        onChange={e => updateItemDiscount(idx, 'discountType', e.target.value)}
                      >
                        <option value="flat">$</option>
                        <option value="percentage">%</option>
                      </select>
                      <input
                        type="number"
                        className="w-16 p-1 border rounded text-xs"
                        value={item.discountValue || ''}
                        onChange={e => updateItemDiscount(idx, 'discountValue', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  </td>
                  <td className="p-4 font-medium">
                    ${((item.unitPrice * item.quantity) - (item.discountType === 'percentage' ? (item.unitPrice * item.quantity * (item.discountValue || 0) / 100) : (item.discountValue || 0))).toFixed(2)}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => removeProduct(idx)} className="text-red-500 hover:text-red-700">Remove</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500">No items added yet. Pick products from the sidebar.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h2 className="font-bold mb-4 text-lg">Product Catalog</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {products?.map(p => (
              <div
                key={p.sku}
                className="p-3 border rounded cursor-pointer hover:bg-blue-50 transition flex justify-between items-center"
                onClick={() => addProduct(p)}
              >
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.sku}</div>
                </div>
                <div className="font-bold text-sm">${p.basePrice}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border space-y-3">
          <h2 className="font-bold mb-4 text-lg">Quote Summary</h2>

          <div className="space-y-2 pb-4 border-b">
            <label className="block text-xs font-medium text-gray-500 uppercase">Global Discount</label>
            <div className="flex gap-2">
              <select
                className="p-2 border rounded text-sm bg-gray-50"
                value={globalDiscountType}
                onChange={e => setGlobalDiscountType(e.target.value as any)}
              >
                <option value="flat">Flat Amount ($)</option>
                <option value="percentage">Percentage (%)</option>
              </select>
              <input
                type="number"
                className="w-24 p-2 border rounded text-sm"
                value={globalDiscountValue}
                onChange={e => setGlobalDiscountValue(parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discounted Subtotal:</span>
            <span className="font-medium">${totals.discountedSubtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="font-medium">${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Grand Total:</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition disabled:bg-gray-400"
          >
            {isSaving ? 'Saving...' : 'Create Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}
