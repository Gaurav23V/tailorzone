import BaseLayout from '@/components/layout/BaseLayout';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <BaseLayout>{children}</BaseLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
