import React from 'react';
import Providers from './providers';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Providers>
          <nav className="p-4 border-b bg-white flex justify-between items-center">
            <span className="font-bold text-xl">ProductHubb</span>
            <div className="space-x-4">
              <a href="/" className="text-gray-600 hover:text-black">Home</a>
              <a href="/quotes" className="text-gray-600 hover:text-black">Quotes</a>
              <a href="/catalog" className="text-gray-600 hover:text-black">Catalog</a>
            </div>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  );
}
