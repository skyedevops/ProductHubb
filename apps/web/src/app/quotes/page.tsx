'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/api-client';
import { Quote } from '@producthubb/shared';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function QuotesPage() {
  const router = useRouter();
  const { data: quotes, isLoading, error } = useQuery<Quote[]>({
    queryKey: ['my-quotes'],
    queryFn: () => apiRequest<Quote[]>('/quotes'),
  });

  React.useEffect(() => {
    if (!localStorage.getItem('producthubb-auth')) {
      router.push('/login');
    }
  }, [router]);

  if (isLoading) return <div className="p-8 text-center">Loading quotes...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Quotes</h1>
        <Link
          href="/quotes/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Create New Quote
        </Link>
      </div>

      {error && <div className="p-4 bg-red-100 text-red-700 rounded mb-4">Error loading quotes</div>}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 font-semibold">Quote #</th>
              <th className="p-4 font-semibold">Version</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Total</th>
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {quotes?.map((quote) => (
              <tr key={quote.id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-mono text-sm">{quote.quoteNumber}</td>
                <td className="p-4 text-sm">v{quote.version}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    quote.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    quote.status === 'Sent' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="p-4 font-bold">${quote.total.toFixed(2)}</td>
                <td className="p-4 text-sm text-gray-500">{quote.createdAt ? new Date(quote.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="p-4 text-right">
                  <Link
                    href={`/quotes/${quote.id}`}
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Quote
                  </Link>
                </td>
              </tr>
            ))}
            {quotes?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-500">No quotes found. Start by creating one!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
