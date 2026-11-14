import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

const getLocalProducts = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalProducts = (products) => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
};

export const productService = {
  // Query all products with rich filters and sorting
  async getProducts(filters = {}) {
    let products = [];

    if (isFirebaseConfigured() && db) {
      try {
        const q = query(collection(db, 'products'), where('published', '==', true));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
          products = getLocalProducts();
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using local store:', err);
        products = getLocalProducts();
      }
    } else {
      products = getLocalProducts();
    }

    // Apply filtering
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => 
        p.categoryId?.toLowerCase() === filters.category.toLowerCase() ||
        p.categorySlug?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.brand && filters.brand !== 'all') {
      products = products.filter(p => 
        p.brandId?.toLowerCase() === filters.brand.toLowerCase() ||
        p.brandName?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    if (filters.gender && filters.gender !== 'all') {
      products = products.filter(p => p.gender?.toLowerCase() === filters.gender.toLowerCase());
    }

    if (filters.fragranceFamily && filters.fragranceFamily !== 'all') {
      products = products.filter(p => p.fragranceFamily?.toLowerCase().includes(filters.fragranceFamily.toLowerCase()));
    }

    if (filters.concentration && filters.concentration !== 'all') {
      products = products.filter(p => p.concentration?.toLowerCase().includes(filters.concentration.toLowerCase()));
    }

    if (filters.bestseller) {
      products = products.filter(p => p.bestseller);
    }

    if (filters.newArrival) {
      products = products.filter(p => p.newArrival);
    }

    if (filters.featured) {
      products = products.filter(p => p.featured);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      products = products.filter(p => 
        p.name?.toLowerCase().includes(q) ||
        p.brandName?.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.fragranceFamily?.toLowerCase().includes(q) ||
        p.topNotes?.some(n => n.toLowerCase().includes(q)) ||
        p.middleNotes?.some(n => n.toLowerCase().includes(q)) ||
        p.baseNotes?.some(n => n.toLowerCase().includes(q))
      );
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      products = products.filter(p => {
        const minVariantPrice = Math.min(...(p.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
        const minOk = filters.minPrice ? minVariantPrice >= filters.minPrice : true;
        const maxOk = filters.maxPrice ? minVariantPrice <= filters.maxPrice : true;
        return minOk && maxOk;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low-high':
          products.sort((a, b) => {
            const priceA = Math.min(...(a.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
            const priceB = Math.min(...(b.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
            return priceA - priceB;
          });
          break;
        case 'price-high-low':
          products.sort((a, b) => {
            const priceA = Math.min(...(a.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
            const priceB = Math.min(...(b.variants?.map(v => v.discountPrice || v.sellingPrice) || [0]));
            return priceB - priceA;
          });
          break;
        case 'rating':
          products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        case 'popularity':
          products.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          break;
        case 'newest':
        default:
          // default order or by id
          break;
      }
    }

    return products;
  },

  // Get a single product by slug
  async getProductBySlug(slug) {
    const products = await this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  // Get a single product by id
  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === id) || null;
  },

  // Create a new product (Admin)
  async createProduct(productData) {
    const newProduct = {
      ...productData,
      id: productData.id || `prod-${Date.now()}`,
      slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      rating: productData.rating || 5.0,
      reviewCount: productData.reviewCount || 0,
      published: productData.published !== undefined ? productData.published : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'products', newProduct.id), newProduct);
      } catch (e) {
        console.warn('Firestore set failed, saving locally:', e);
      }
    }

    const local = getLocalProducts();
    local.unshift(newProduct);
    saveLocalProducts(local);
    return newProduct;
  },

  // Update product (Admin)
  async updateProduct(id, productData) {
    const updated = {
      ...productData,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'products', id), updated);
      } catch (e) {
        console.warn('Firestore update failed, updating locally:', e);
      }
    }

    const local = getLocalProducts();
    const idx = local.findIndex(p => p.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updated };
      saveLocalProducts(local);
      return local[idx];
    }
    return null;
  },

  // Delete product (Admin)
  async deleteProduct(id) {
    if (isFirebaseConfigured() && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (e) {
        console.warn('Firestore delete failed:', e);
      }
    }

    const local = getLocalProducts().filter(p => p.id !== id);
    saveLocalProducts(local);
    return true;
  },

  // Update variant stock after order placement or manual adjustment
  async updateStock(productId, variantId, quantityChange) {
    const local = getLocalProducts();
    const product = local.find(p => p.id === productId);
    if (product && product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        variant.stock = Math.max(0, (variant.stock || 0) + quantityChange);
        saveLocalProducts(local);
        return variant.stock;
      }
    }
    return 0;
  },

  // Related products based on category or fragrance family
  async getRelatedProducts(currentId, categoryId, count = 4) {
    const products = await this.getProducts();
    return products
      .filter(p => p.id !== currentId && (p.categoryId === categoryId || p.featured))
      .slice(0, count);
  },
};
