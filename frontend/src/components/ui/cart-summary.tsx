import { Button } from "@/components/ui/button"

interface CartSummaryProps {
  subtotal: number;
  shippingFee: number;
  total: number;
  onCheckout: () => void;
}

export function CartSummaryCard({ subtotal, shippingFee, total, onCheckout }: CartSummaryProps) {
  return (
    <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">CART TOTALS —</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">Subtotal</p>
          <p className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">Shipping</p>
          <p className="text-sm font-medium text-gray-900">
            {shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}
          </p>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-base font-medium text-gray-900">Total</p>
          <p className="text-base font-medium text-gray-900">₹{total.toFixed(2)}</p>
        </div>
      </div>
      <Button
        onClick={onCheckout}
        className="mt-6 w-full"
        disabled={subtotal === 0}
      >
        PROCEED TO CHECKOUT
      </Button>
    </div>
  );
}
