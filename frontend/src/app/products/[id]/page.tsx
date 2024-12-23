'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Star, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart'; // Assuming you have a cart context/hook
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: {
    url: string;
    alt?: string;
    isDefault: boolean;
  }[];
  inventory: {
    quantity: number;
    sku: string;
  };
  attributes: {
    name: string;
    value: string;
  }[];
  ratings: {
    average: number;
    count: number;
  };
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>(
    'description'
  );
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { addToCart, state } = useCart();
  const params = useParams();
  const id = params.id;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`
        );
        if (!response.ok) throw new Error('Failed to fetch product');
        const data = await response.json();
        setProduct(data);

        // Fetch related products from same category
        const relatedResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?category=${data.category._id}&limit=4`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(
            relatedData.products.filter((p: Product) => p._id !== params.id)
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, id]);

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        productId: product._id,
        quantity: 1,
        product: {
          _id: product._id,
          name: product.name,
          price: product.price,
          salePrice: product.salePrice,
          images: product.images,
          inventory: {
            quantity: product.inventory.quantity
          }
        }
      });
      toast.success('Added to cart successfully');
    } catch (err) {
      toast.error(`Failed to add to cart: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer position="bottom-right" />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-[100px_1fr] gap-4">
            {/* Thumbnails */}
            <div className="flex flex-col space-y-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                    selectedImage === index
                      ? 'border-black'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || product.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </button>
              ))}
            </div>
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt || product.name}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>

            {/* Category */}
            <p className="mt-2 text-sm text-gray-500">
              {product.category.name}
            </p>

            {/* Rating */}
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`h-4 w-4 ${
                      rating <= product.ratings.average
                        ? 'fill-rose-500 text-rose-500'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({product.ratings.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4">
              {product.salePrice ? (
                <div className="flex items-center space-x-2">
                  <p className="text-2xl font-bold text-red-600">
                    ₹{product.salePrice}
                  </p>
                  <p className="text-lg text-gray-500 line-through">
                    ₹{product.price}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-bold">₹{product.price}</p>
              )}
            </div>

            {/* Stock Status */}
            <p
              className={`mt-2 text-sm ${
                product.inventory.quantity > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {product.inventory.quantity > 0
                ? `In stock (${product.inventory.quantity} available)`
                : 'Out of stock'}
            </p>

            {/* Description */}
            <p className="mt-4 text-gray-600">{product.description}</p>

            {/* Add to Cart */}
            <Button
              className="mt-8 w-full"
              onClick={handleAddToCart}
              disabled={product.inventory.quantity === 0 || state.isLoading}
            >
              {state.isLoading
                ? 'Adding to Cart...'
                : product.inventory.quantity === 0
                  ? 'Out of Stock'
                  : 'Add to Cart'}
            </Button>

            {/* Additional Info */}
            <ul className="mt-8 space-y-2 text-sm text-gray-600">
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2" />
                100% Original Product
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2" />
                Cash on delivery is available on this product
              </li>
              <li className="flex items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-600 mr-2" />
                Easy return and exchange policy within 7 days
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 text-sm font-medium ${
                  activeTab === 'description'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-black text-black'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                Reviews ({product.ratings.count})
              </button>
            </div>
          </div>
          <div className="py-6">
            {activeTab === 'description' ? (
              <div className="prose max-w-none">
                <p className="text-gray-600">{product.description}</p>
              </div>
            ) : (
              <div className="text-gray-600">
                <p>Customer reviews will be displayed here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-xl font-semibold mb-6">RELATED PRODUCTS —</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <div key={product._id} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={product.images[0].url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
