export const BRAND = {
  name: 'AB Noor Perfumes',
  shortName: 'AB Noor',
  tagline: 'The Essence of Masculine Elegance',
  secondaryTagline: 'Artisanal Arabian Fragrances for the Discerning Gentleman',
  established: '1998',
  email: 'concierge@abnoorperfumes.com',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  address: {
    line1: 'Royal Oud Boutique, Luxury Promenade',
    line2: 'Colaba Causeway',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400005',
    country: 'India',
  },
  socials: {
    instagram: 'https://instagram.com/abnoorperfumes',
    facebook: 'https://facebook.com/abnoorperfumes',
    pinterest: 'https://pinterest.com/abnoorperfumes',
    youtube: 'https://youtube.com/@abnoorperfumes',
  },
  shipping: {
    freeThreshold: 2499, // Free luxury shipping above ₹2,499
    standardCost: 150,
    expressCost: 350,
  },
  currency: {
    symbol: '₹',
    code: 'INR',
    name: 'Indian Rupee',
  },
  colors: {
    emerald: '#103B2D',
    darkForest: '#0B2119',
    luxuryGold: '#C6A15B',
    softGold: '#E5D3A3',
    ivory: '#F8F5EF',
    white: '#FFFFFF',
    charcoal: '#171717',
    mutedGrey: '#777777',
  },
};

export const FRAGRANCE_FAMILIES = [
  { id: 'oriental-oud', name: 'Royal Oud & Woods', description: 'Rare aged Cambodian, Hindi, and Trat agarwoods with balsamic resins.' },
  { id: 'leather-tobacco', name: 'Smoked Leather & Tobacco', description: 'Cordovan saddle leather, cured tobacco leaves, and dark roasted woods.' },
  { id: 'spicy-amber', name: 'Spicy Amber & Saffron', description: 'Kashmiri saffron, green cardamom, cinnamon bark, and rich benzoin.' },
  { id: 'woody-smoky', name: 'Smoky Vetiver & Incense', description: 'Smoked birch, frankincense tears, vetiver roots, and black labdanum.' },
  { id: 'fresh-citrus', name: 'Executive Citrus & Marine Woods', description: 'Sparkling blood orange, bergamot, sea salt, and white agarwood.' },
  { id: 'musk', name: 'Primal Musk & Sandalwood', description: 'Cruelty-free deer musk accords aged over Mysore sandalwood.' },
];

export const CONCENTRATIONS = [
  { id: 'extrait', name: 'Extrait de Parfum (Men)', oilPercentage: '35% - 40%', longevity: '18 - 24+ Hours' },
  { id: 'edp', name: 'Eau de Parfum (EDP)', oilPercentage: '18% - 25%', longevity: '10 - 14 Hours' },
  { id: 'attar', name: 'Pure Concentrated Perfume Oil (Attar)', oilPercentage: '100% Oil', longevity: '24 - 36+ Hours' },
];

export const GENDERS = [
  { id: 'men', name: "Men's Luxury Exclusive" },
];

export const OCCASIONS = [
  { id: 'boardroom', name: 'Executive Boardroom & Leadership' },
  { id: 'black-tie', name: 'Evening Black-Tie & Royal Galas' },
  { id: 'signature', name: 'Daily Sovereign Signature' },
  { id: 'weekend', name: 'Warm Weather & Coastal Leisure' },
];

export const SIZES = ['6ml', '12ml', '30ml', '50ml', '100ml'];

export const ORDER_STATUSES = [
  { id: 'pending', label: 'Pending Payment', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'placed', label: 'Order Placed', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { id: 'confirmed', label: 'Confirmed by Concierge', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'processing', label: 'In Preparation', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { id: 'packed', label: 'Sealed in Emerald Box', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { id: 'shipped', label: 'Shipped via Express', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { id: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'delivered', label: 'Delivered to Patron', color: 'bg-green-100 text-green-800 border-green-300' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'refunded', label: 'Refunded', color: 'bg-gray-100 text-gray-800 border-gray-300' },
];
