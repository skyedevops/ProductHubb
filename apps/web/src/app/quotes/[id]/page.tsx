'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { Quote } from '@producthubb/shared';
import { useRouter } from 'next/navigation';

export default function QuoteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: quote, isLoading, error } = useQuery<Quote>({
    queryKey: ['quote', params.id],
    queryFn: () => apiRequest<Quote>(`/quotes/${params.id}`),
  });

  const handleVersion = async () => {
    try {
      await apiRequest(`/quotes/${params.id}/version`, { method: 'POST' });
      alert('New version created successfully!');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading quote...</div>;
  if (!quote) return <div className="p-8 text-center">Quote not found</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Quote {quote.quoteNumber}</h1>
        <div className="space-x-2">
          <button
            onClick={() => router.push('/quotes')}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Back to List
          </button>
          <button
            onClick={handleVersion}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Create New Version
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow border space-y-6">
        <div className="grid grid-cols-2 gap-4 border-b pb-6">
          <div>
            <div className="text-xs text-gray-500 uppercase font-semibold">Customer ID</div>
            <div className="font-medium">{quote.customerId}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase font-semibold">Version</div>
            <div className="font-medium">v{quote.version}</div>
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="border-b">
            <tr>
              <th className="py-2 font-semibold">Product</th>
              <th className="py-2 font-semibold text-right">Qty</th>
              <th className="py-2 font-semibold text-right">Unit Price</th>
              <th className="py-2 font-semibold text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, idx) => (
              <tr key={idx} className="border-b last:border-0">
                <td className="py-3">{item.productId}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">${item.unitPrice.toFixed(2)}</td>
                <td className="py-3 text-right font-medium">${(item.unitPrice * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end space-y-2">
          <div className="text-sm flex justify-between w-48">
            <span>Subtotal:</span>
            <span>${quote.subtotal.toFixed(2)}</span>
          </div>
          <div className="text-sm flex justify-between w-48">
            <span>Tax (10%):</span>
            <span>${quote.tax.toFixed(2)}</span>
          </div>
          <div className="text-lg font-bold flex justify-between w-48 border-t pt-2">
            <span>Total:</span>
            <span>${quote.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
