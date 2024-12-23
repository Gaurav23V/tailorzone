'use client';
import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { FilterState } from '@/types';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface FiltersProps {
  currentFilters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function Filters({ currentFilters, onFilterChange }: FiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/category`);
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string) => {
    const newCategories = currentFilters.categories.includes(categoryId)
      ? currentFilters.categories.filter((id) => id !== categoryId)
      : [...currentFilters.categories, categoryId];

    onFilterChange({
      ...currentFilters,
      categories: newCategories,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    setPriceRange(value as [number, number]);
    onFilterChange({
      ...currentFilters,
      priceRange: {
        min: value[0],
        max: value[1],
      },
    });
  };

  const handleSearchSubmit = () => {
    onFilterChange({
      ...currentFilters,
      search: searchQuery,
    });
  };

  const handleReset = () => {
    setPriceRange([0, 10000]);
    setSearchQuery('');
    onFilterChange({
      categories: [],
      priceRange: {},
      search: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Search Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Search</h3>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1" label={''}          />
          <Button size="icon" onClick={handleSearchSubmit}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Price Range</h3>
        <Slider
          defaultValue={[0, 10000]}
          max={10000}
          step={100}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
          className="mt-2"
        />
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Categories</h3>
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-6 bg-gray-200 rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category._id} className="flex items-center space-x-2">
                <Checkbox
                  id={category._id}
                  checked={currentFilters.categories.includes(category._id)}
                  onCheckedChange={() => handleCategoryChange(category._id)}
                />
                <label
                  htmlFor={category._id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset Filters */}
      <Button variant="outline" className="w-full" onClick={handleReset}>
        Reset Filters
      </Button>
    </div>
  );
}