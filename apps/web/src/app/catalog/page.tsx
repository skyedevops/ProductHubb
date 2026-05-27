'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { Product } from '@producthubb/shared';
import { useAuthStore } from '@/store/auth-store';
import { useRouter } from 'next/navigation';

export default function CatalogPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => apiRequest<Product[]>('/products'),
  });

  React.useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Catalog</h1>
      </div>

      {isLoading && <div className="text-center py-10">Loading products...</div>}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">{error instanceof Error ? error.message : 'An error occurred'}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <div key={product.id || product.sku} className="p-6 bg-white rounded-lg shadow border hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg">{product.name}</h3>
              <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">{product.sku}</span>
            </div>
            <p className="text-gray-600 text-sm mb-4 h-12 overflow-hidden">
              {product.description || 'No description available.'}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">${product.basePrice.toFixed(2)}</span>
              <button
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                onClick={() => alert(`Product ${product.sku} selected for quote`)}
              >
                Add to Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
