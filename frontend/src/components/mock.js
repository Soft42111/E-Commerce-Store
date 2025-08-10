// Mock data for LuxuryLine e-commerce store

export const mockProducts = [
  // Sneakers Collection
  {
    id: 1,
    name: "Elite High-Top Sneakers",
    category: "sneakers",
    price: 350,
    originalPrice: 450,
    description: "Premium leather high-top sneakers with gold accents and superior comfort technology.",
    images: [
      "https://images.unsplash.com/photo-1543652711-77eeb35ae548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzbmVha2Vyc3xlbnwwfHx8fDE3NTQ4MjE5OTV8MA&ixlib=rb-4.1.0&q=85",
      "https://images.unsplash.com/photo-1596936273467-b3af0c82af7a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBzbmVha2Vyc3xlbnwwfHx8fDE3NTQ4MjE5OTV8MA&ixlib=rb-4.1.0&q=85"
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    colors: ["White", "Black", "Gold"],
    featured: true,
    onSale: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: 2,
    name: "Urban Luxury Sneakers",
    category: "sneakers",
    price: 280,
    description: "Contemporary design meets comfort in these premium urban sneakers.",
    images: [
      "https://images.pexels.com/photos/8764560/pexels-photo-8764560.jpeg",
      "https://images.unsplash.com/photo-1710472171182-ada20c1c21c4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["White", "Black"],
    featured: false,
    onSale: false,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: "Executive Gold Series",
    category: "sneakers",
    price: 420,
    description: "Limited edition sneakers with 24k gold detailing for the discerning collector.",
    images: [
      "https://images.unsplash.com/photo-1710472171087-1cdec8a3b162?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85",
      "https://images.pexels.com/photos/1374910/pexels-photo-1374910.jpeg"
    ],
    sizes: ["US 8", "US 9", "US 10", "US 11"],
    colors: ["Black", "Gold"],
    featured: true,
    onSale: false,
    rating: 4.9,
    reviews: 203
  },
  {
    id: 4,
    name: "Minimalist Court Classic",
    category: "sneakers",
    price: 295,
    description: "Clean lines and premium materials define this timeless court-inspired design.",
    images: [
      "https://images.unsplash.com/photo-1695459590088-d6fd3cc97cfa?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    colors: ["White", "Black"],
    featured: false,
    onSale: false,
    rating: 4.5,
    reviews: 76
  },
  {
    id: 5,
    name: "Street Luxury Runner",
    category: "sneakers",
    price: 380,
    originalPrice: 450,
    description: "Performance meets luxury in these premium running-inspired sneakers.",
    images: [
      "https://images.unsplash.com/photo-1710317959021-36dfca8a9abd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Black", "Red"],
    featured: false,
    onSale: true,
    rating: 4.7,
    reviews: 142
  },

  // Crockery Collection
  {
    id: 6,
    name: "Midnight Ceramic Cup Set",
    category: "crockery",
    price: 120,
    description: "Elegant black ceramic cups with gold rim detailing, perfect for luxury dining.",
    images: [
      "https://images.unsplash.com/photo-1551713161-57985fb35b99?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjcm9ja2VyeXxlbnwwfHx8fDE3NTQ4MjIwMzF8MA&ixlib=rb-4.1.0&q=85"
    ],
    materials: ["Ceramic", "Gold Rim"],
    colors: ["Black", "Gold"],
    featured: true,
    onSale: false,
    rating: 4.8,
    reviews: 94,
    setSize: "Set of 2"
  },
  {
    id: 7,
    name: "Premium Serving Tray",
    category: "crockery",
    price: 185,
    description: "Minimalist black serving tray crafted from premium materials for sophisticated entertaining.",
    images: [
      "https://images.unsplash.com/photo-1559847844-1ff4d5bcd3b4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjcm9ja2VyeXxlbnwwfHx8fDE3NTQ4MjIwMzF8MA&ixlib=rb-4.1.0&q=85"
    ],
    materials: ["Bamboo", "Matte Finish"],
    colors: ["Black"],
    featured: false,
    onSale: false,
    rating: 4.6,
    reviews: 67
  },
  {
    id: 8,
    name: "Pure Porcelain Tea Set",
    category: "crockery",
    price: 245,
    originalPrice: 320,
    description: "Handcrafted porcelain tea set with delicate gold accents for refined tea ceremonies.",
    images: [
      "https://images.pexels.com/photos/6739708/pexels-photo-6739708.jpeg"
    ],
    materials: ["Fine Porcelain", "Gold Accent"],
    colors: ["White", "Gold"],
    featured: true,
    onSale: true,
    rating: 4.9,
    reviews: 156,
    setSize: "Set of 4"
  },
  {
    id: 9,
    name: "Vintage Crystal Collection",
    category: "crockery",
    price: 380,
    description: "Exquisite vintage-inspired crystal teacups with ornate gold detailing.",
    images: [
      "https://images.pexels.com/photos/3268625/pexels-photo-3268625.jpeg"
    ],
    materials: ["Crystal", "Gold Plating"],
    colors: ["Crystal Clear", "Gold"],
    featured: false,
    onSale: false,
    rating: 4.7,
    reviews: 89,
    setSize: "Set of 6"
  },
  {
    id: 10,
    name: "Executive Dinner Plates",
    category: "crockery",
    price: 295,
    description: "Premium white dinner plates with subtle gold rim for elegant dining experiences.",
    images: [
      "https://images.unsplash.com/photo-1714579340610-88f3a5ce6a18?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwdGFibGV3YXJlfGVufDB8fHx8MTc1NDgyMjAzN3ww&ixlib=rb-4.1.0&q=85"
    ],
    materials: ["Fine Bone China", "Gold Rim"],
    colors: ["White", "Gold"],
    featured: false,
    onSale: false,
    rating: 4.8,
    reviews: 123,
    setSize: "Set of 8"
  },
  {
    id: 11,
    name: "Luxury Presentation Set",
    category: "crockery",
    price: 425,
    description: "Complete luxury tableware set for fine dining and special occasions.",
    images: [
      "https://images.unsplash.com/photo-1714579324629-da46dd0d7d85?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwdGFibGV3YXJlfGVufDB8fHx8MTc1NDgyMjAzN3ww&ixlib=rb-4.1.0&q=85"
    ],
    materials: ["Porcelain", "Gold Accent"],
    colors: ["White", "Gold"],
    featured: true,
    onSale: false,
    rating: 4.9,
    reviews: 201,
    setSize: "Complete Set"
  },
  {
    id: 12,
    name: "Artisan Ceramic Bowl",
    category: "crockery",
    price: 165,
    description: "Handcrafted ceramic bowl with unique texture and premium finish for artistic presentation.",
    images: [
      "https://images.pexels.com/photos/8112969/pexels-photo-8112969.jpeg"
    ],
    materials: ["Handmade Ceramic"],
    colors: ["Natural", "Cream"],
    featured: false,
    onSale: false,
    rating: 4.6,
    reviews: 78
  },

  // Additional Mixed Products
  {
    id: 13,
    name: "Heritage Low-Top Collection",
    category: "sneakers",
    price: 315,
    description: "Classic low-top design with modern luxury materials and heritage craftsmanship.",
    images: [
      "https://images.unsplash.com/photo-1543652711-77eeb35ae548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzbmVha2Vyc3xlbnwwfHx8fDE3NTQ4MjE5OTV8MA&ixlib=rb-4.1.0&q=85"
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    colors: ["White", "Black", "Brown"],
    featured: false,
    onSale: false,
    rating: 4.5,
    reviews: 92
  },
  {
    id: 14,
    name: "Royal Wine Glass Set",
    category: "crockery",
    price: 220,
    originalPrice: 280,
    description: "Crystal wine glasses with elegant stems for sophisticated wine tasting experiences.",
    images: [
      "https://images.pexels.com/photos/6739708/pexels-photo-6739708.jpeg"
    ],
    materials: ["Lead Crystal"],
    colors: ["Clear"],
    featured: false,
    onSale: true,
    rating: 4.7,
    reviews: 134,
    setSize: "Set of 6"
  },
  {
    id: 15,
    name: "Premium Sport Elite",
    category: "sneakers",
    price: 395,
    description: "High-performance luxury sneakers designed for the modern athlete with style.",
    images: [
      "https://images.unsplash.com/photo-1710472171087-1cdec8a3b162?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwZm9vdHdlYXJ8ZW58MHx8fHwxNzU0ODIyMDAwfDA&ixlib=rb-4.1.0&q=85"
    ],
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Black", "Gold", "Red"],
    featured: true,
    onSale: false,
    rating: 4.8,
    reviews: 167
  }
];

export const categories = [
  {
    id: 1,
    name: "Sneakers",
    slug: "sneakers",
    description: "Premium sneaker collection for enthusiasts",
    image: "https://images.unsplash.com/photo-1543652711-77eeb35ae548?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzbmVha2Vyc3xlbnwwfHx8fDE3NTQ4MjE5OTV8MA&ixlib=rb-4.1.0&q=85"
  },
  {
    id: 2,
    name: "Crockery",
    slug: "crockery", 
    description: "Luxury tableware for refined dining",
    image: "https://images.unsplash.com/photo-1551713161-57985fb35b99?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjcm9ja2VyeXxlbnwwfHx8fDE3NTQ4MjIwMzF8MA&ixlib=rb-4.1.0&q=85"
  }
];

export const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Fashion Enthusiast",
    content: "The quality of LuxuryLine products is unmatched. Every piece feels like a work of art.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b5cc?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "James Chen",
    role: "Collector",
    content: "I've been collecting luxury sneakers for years, and LuxuryLine consistently exceeds expectations.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Elena Rodriguez",
    role: "Interior Designer",
    content: "Their crockery collection perfectly complements high-end dining experiences. Absolutely stunning.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];