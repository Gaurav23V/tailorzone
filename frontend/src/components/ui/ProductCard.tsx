import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils' // We'll create this utility

interface Product {
  _id: string
  name: string
  description: string
  price: number
  salePrice?: number
  category: {
    _id: string
    name: string
    slug: string
  }
  images: {
    url: string
    alt?: string
    isDefault: boolean
  }[]
  inventory: {
    quantity: number
    sku: string
  }
  ratings: {
    average: number
    count: number
  }
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  // Get the default image or the first image
  const displayImage = product.images.find(img => img.isDefault) || product.images[0]

  // Check if product is on sale
  const isOnSale = product.salePrice && product.salePrice < product.price

  // Check if product is in stock
  const isInStock = product.inventory.quantity > 0

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative">
        <div className="relative aspect-square transition-transform group-hover:scale-105">
          <Image
            src={displayImage.url}
            alt={displayImage.alt || product.name}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          />

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
              SALE
            </div>
          )}

          {/* Out of Stock Badge */}
          {!isInStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-sm font-medium">Out of Stock</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between items-start">
          <h3 className="text-sm font-medium text-gray-900 group-hover:underline">
            {product.name}
          </h3>

          {/* Rating */}
          {product.ratings.count > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                {product.ratings.average.toFixed(1)}
              </span>
              <svg
                className="w-4 h-4 text-yellow-400 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs text-gray-500 ml-1">
                ({product.ratings.count})
              </span>
            </div>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          {isOnSale ? (
            <>
              <p className="text-sm text-red-600 font-medium">
                {formatPrice(product.salePrice!)}
              </p>
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </p>
            </>
          ) : (
            <p className="text-sm text-gray-900">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        {/* Category */}
        <p className="text-xs text-gray-500">
          {product.category.name}
        </p>
      </div>
    </Link>
  )
}