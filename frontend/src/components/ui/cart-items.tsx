import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (id: string, quantity: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function CartItemCard({
  id,
  name,
  price,
  image,
  quantity,
  maxQuantity,
  onQuantityChange,
  onDelete,
}: CartItemProps) {
  const handleQuantityChange = async (value: string) => {
    try {
      await onQuantityChange(id, parseInt(value));
    } catch (error) {
      // Handle error if needed
      console.error('Failed to update quantity:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(id);
    } catch (error) {
      // Handle error if needed
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">₹{price}</p>
            {maxQuantity < 5 && (
              <p className="mt-1 text-xs text-red-500">
                Only {maxQuantity} left in stock
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Select
              defaultValue={quantity.toString()}
              onValueChange={handleQuantityChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: Math.min(maxQuantity, 10) },
                  (_, i) => i + 1
                ).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500"
            >
              <Trash2 className="h-5 w-5" />
              <span className="sr-only">Remove item</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}