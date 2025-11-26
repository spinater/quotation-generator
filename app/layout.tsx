import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Thai Quotation & Receipt Generator',
  description: 'Generate professional Thai quotations and receipts with PDF export',
  keywords: ['quotation', 'receipt', 'Thai', 'PDF', 'invoice', 'ใบเสนอราคา', 'ใบเสร็จรับเงิน'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <footer className="bg-white border-t border-gray-200 mt-auto">
              <div className="container mx-auto px-4 py-6">
                <p className="text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} Thai Quotation & Receipt Generator
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
