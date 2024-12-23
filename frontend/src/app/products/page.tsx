'use client';
import { useState, useEffect, useCallback } from 'react';
import { ProductCard } from '@/components/ui/ProductCard';
import { Pagination } from '@/components/ui/Pagination';
import { Filters } from '@/components/ui/Filters';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product, FilterState } from '@/types';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOption, setSortOption] = useState<string>('-createdAt');
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: {},
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sort: sortOption,
        ...(filters.categories.length && {
          category: filters.categories.join(','),
        }),
        ...(filters.priceRange.min && {
          minPrice: filters.priceRange.min.toString(),
        }),
        ...(filters.priceRange.max && {
          maxPrice: filters.priceRange.max.toString(),
        }),
        ...(filters.search && { search: filters.search }),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products?${queryParams}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, sortOption, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif">ALL COLLECTIONS —</h1>
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-createdAt">Newest First</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="-price">Price: High to Low</SelectItem>
              <SelectItem value="-ratings.average">Best Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-6">FILTERS</h2>
              <Filters
                currentFilters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                No products found matching your criteria
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
