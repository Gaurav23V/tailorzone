'use client';

import { useEffect, useState } from 'react';
import { ProductBanner } from '@/components/ui/product-banner';
import { ProductCard } from '@/components/ui/product-card';
import { FeaturesSection } from '@/components/ui/feature-section';
import { NewsletterSection } from '@/components/ui/newsletter-section';
import { Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  images: {
    url: string;
    alt?: string;
    isDefault: boolean;
  }[];
}

export default function HomePage() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [featuredProduct, setFeaturedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch latest products (sorted by createdAt in descending order)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?sort=-createdAt&limit=8`);
        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();

        // Set the first product as featured and rest as latest products
        if (data.products.length > 0) {
          setFeaturedProduct(data.products[0]);
          setLatestProducts(data.products.slice(1));
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Banner */}
        {featuredProduct && (
          <div className="py-8">
            <ProductBanner
              tagline="NEW ARRIVAL"
              title={featuredProduct.name}
              imageUrl={featuredProduct.images.find(img => img.isDefault)?.url || featuredProduct.images[0].url}
            />
          </div>
        )}

        {/* Latest Collections */}
        <div className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-medium inline-flex items-center gap-4">
              <span className="h-px w-8 bg-black" />
              LATEST COLLECTIONS
              <span className="h-px w-8 bg-black" />
            </h2>
            <p className="mt-4 text-gray-500">
              Discover our newest arrivals and trending styles
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestProducts.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.salePrice || product.price}
                image={product.images.find(img => img.isDefault)?.url || product.images[0].url}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <FeaturesSection />

        {/* Newsletter Section */}
        <NewsletterSection />
      </div>
    </main>
  );
}