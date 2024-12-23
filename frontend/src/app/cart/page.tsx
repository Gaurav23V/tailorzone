'use client';

import { useEffect } from 'react';
import { CartItemCard } from '@/components/ui/cart-items';
import { CartSummaryCard } from '@/components/ui/cart-summary';
import { useCart } from '@/hooks/useCart';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const { state, updateQuantity, removeFromCart } = useCart();

  // Calculate totals
  const subtotal = state.items.reduce((sum, item) => {
    const price = item.product.salePrice || item.product.price;
    return sum + (price * item.quantity);
  }, 0);

  const shippingFee = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = subtotal + shippingFee;

  const handleQuantityChange = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
      toast.success('Cart updated successfully');
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        <div className="lg:col-span-7">
          <h1 className="text-2xl font-medium text-gray-900">YOUR CART —</h1>
          {state.error && (
            <p className="mt-4 text-red-600">{state.error}</p>
          )}
          {state.items.length === 0 ? (
            <div className="mt-6 text-center">
              <p className="text-gray-500">Your cart is empty</p>
              <a
                href="/products"
                className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-500"
              >
                Continue Shopping →
              </a>
            </div>
          ) : (
            <div className="mt-6 divide-y divide-gray-200">
              {state.items.map((item) => (
                <CartItemCard
                  key={item.product._id}
                  id={item.product._id}
                  name={item.product.name}
                  price={item.product.salePrice || item.product.price}
                  image={item.product.images.find(img => img.isDefault)?.url || item.product.images[0].url}
                  quantity={item.quantity}
                  maxQuantity={item.product.inventory.quantity}
                  onQuantityChange={handleQuantityChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-16 lg:mt-0 lg:col-span-5">
          <CartSummaryCard
            subtotal={subtotal}
            shippingFee={shippingFee}
            total={total}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}