import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, Grid, List, ChevronDown, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { mockProducts, categories } from '../components/mock';

const Shop = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [filters, setFilters] = useState({
    category: category || 'all',
    priceRange: [0, 500],
    colors: [],
    sizes: [],
    materials: [],
    onSale: false,
    featured: false
  });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique filter options
  const getUniqueValues = (key) => {
    const values = mockProducts.flatMap(product => product[key] || []);
    return [...new Set(values)];
  };

  const colorOptions = getUniqueValues('colors');
  const sizeOptions = getUniqueValues('sizes');
  const materialOptions = getUniqueValues('materials');

  useEffect(() => {
    let filtered = mockProducts;

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors && product.colors.some(color => filters.colors.includes(color))
      );
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes && product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Material filter
    if (filters.materials.length > 0) {
      filtered = filtered.filter(product =>
        product.materials && product.materials.some(material => filters.materials.includes(material))
      );
    }

    // On Sale filter
    if (filters.onSale) {
      filtered = filtered.filter(product => product.onSale);
    }

    // Featured filter
    if (filters.featured) {
      filtered = filtered.filter(product => product.featured);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return b.id - a.id;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [filters, sortBy, searchQuery]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleMultiSelectFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: category || 'all',
      priceRange: [0, 500],
      colors: [],
      sizes: [],
      materials: [],
      onSale: false,
      featured: false
    });
  };

  const FilterContent = () => (
    <div className="space-y-6 p-4">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-3 text-black">Price Range</h3>
        <div className="px-2">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => handleFilterChange('priceRange', value)}
            max={500}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Colors */}
      {colorOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-black">Colors</h3>
          <div className="space-y-2">
            {colorOptions.map((color) => (
              <div key={color} className="flex items-center space-x-2">
                <Checkbox
                  id={`color-${color}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={() => handleMultiSelectFilter('colors', color)}
                />
                <label
                  htmlFor={`color-${color}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {color}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizeOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-black">Sizes</h3>
          <div className="space-y-2">
            {sizeOptions.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={() => handleMultiSelectFilter('sizes', size)}
                />
                <label
                  htmlFor={`size-${size}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {size}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materials */}
      {materialOptions.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 text-black">Materials</h3>
          <div className="space-y-2">
            {materialOptions.map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.materials.includes(material)}
                  onCheckedChange={() => handleMultiSelectFilter('materials', material)}
                />
                <label
                  htmlFor={`material-${material}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {material}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Special Filters */}
      <div>
        <h3 className="font-semibold mb-3 text-black">Special</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="on-sale"
              checked={filters.onSale}
              onCheckedChange={(checked) => handleFilterChange('onSale', checked)}
            />
            <label
              htmlFor="on-sale"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              On Sale
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={filters.featured}
              onCheckedChange={(checked) => handleFilterChange('featured', checked)}
            />
            <label
              htmlFor="featured"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Featured Items
            </label>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <Button onClick={clearFilters} variant="outline" className="w-full">
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header */}
      <div className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category ? categories.find(c => c.slug === category)?.name || 'Shop' : searchQuery ? `Search Results: "${searchQuery}"` : 'Shop All Products'}
            </h1>
            <p className="text-gray-300 text-lg">
              {category 
                ? categories.find(c => c.slug === category)?.description || 'Discover our premium collection'
                : searchQuery 
                ? `Found ${filteredProducts.length} results`
                : 'Discover our complete luxury collection'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link to="/" className="text-gray-700 hover:text-yellow-600">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link to="/shop" className="text-gray-700 hover:text-yellow-600">Shop</Link>
            </li>
            {category && (
              <>
                <li>/</li>
                <li className="text-yellow-600 font-medium capitalize">{category}</li>
              </>
            )}
          </ol>
        </nav>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            {/* Mobile Filter Toggle */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>

            {/* Category Filter */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sneakers">Sneakers</SelectItem>
                <SelectItem value="crockery">Crockery</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort By */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="price-low">Price Low to High</SelectItem>
                <SelectItem value="price-high">Price High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md sticky top-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-black">Filters</h2>
                  <Button onClick={clearFilters} variant="ghost" size="sm">
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
                <FilterContent />
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {mockProducts.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-16 w-16 mx-auto mb-4" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <Button onClick={clearFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <div className={`grid gap-8 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Shop;