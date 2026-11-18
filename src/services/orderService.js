import { STORAGE_KEYS } from './storageService';
import { db, isFirebaseConfigured } from '../firebase/config';
import { collection, getDocs, doc, setDoc, updateDoc, query, where } from 'firebase/firestore';
import { productService } from './productService';
import { inventoryService } from './inventoryService';
import { emailService } from './emailService';

const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalOrders = (orders) => {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
};

export const orderService = {
  // Get all orders (Admin or filtered)
  async getOrders(filters = {}) {
    let orders = [];

    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'orders'));
        if (!snap.empty) {
          orders = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } else {
          orders = getLocalOrders();
        }
      } catch (e) {
        console.warn('Firestore orders fetch failed:', e);
        orders = getLocalOrders();
      }
    } else {
      orders = getLocalOrders();
    }

    if (filters.userId) {
      orders = orders.filter(o => o.userId === filters.userId);
    }

    if (filters.status && filters.status !== 'all') {
      orders = orders.filter(o => o.orderStatus === filters.status);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      orders = orders.filter(o => 
        o.orderNumber?.toLowerCase().includes(q) ||
        o.customerSnapshot?.name?.toLowerCase().includes(q) ||
        o.customerSnapshot?.email?.toLowerCase().includes(q) ||
        o.customerSnapshot?.phone?.includes(q)
      );
    }

    // Sort newest first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return orders;
  },

  // Get single order by id or orderNumber
  async getOrderById(id) {
    const orders = await this.getOrders();
    return orders.find(o => o.id === id || o.orderNumber === id) || null;
  },

  // Track order by Order Number and Email/Phone
  async trackOrder(orderNumber, contact) {
    const orders = await this.getOrders();
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanContact = contact.trim().toLowerCase();

    return orders.find(o => {
      const numMatch = o.orderNumber?.toUpperCase() === cleanNum || o.id?.toUpperCase() === cleanNum;
      const contactMatch = 
        o.customerSnapshot?.email?.toLowerCase() === cleanContact ||
        o.customerSnapshot?.phone?.replace(/\D/g, '') === cleanContact.replace(/\D/g, '');
      return numMatch && contactMatch;
    }) || null;
  },

  // Create new order
  async createOrder(orderPayload) {
    const now = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ABN-${new Date().getFullYear()}-${randomSuffix}`;
    const orderId = `ORD-${Date.now()}`;

    const newOrder = {
      id: orderId,
      orderNumber,
      userId: orderPayload.userId || 'guest',
      customerSnapshot: orderPayload.customerSnapshot,
      itemsSnapshot: orderPayload.itemsSnapshot,
      addressSnapshot: orderPayload.addressSnapshot,
      subtotal: orderPayload.subtotal,
      discount: orderPayload.discount || 0,
      couponCode: orderPayload.couponCode || null,
      shippingCharge: orderPayload.shippingCharge || 0,
      tax: orderPayload.tax || 0,
      totalAmount: orderPayload.totalAmount,
      paymentMethod: orderPayload.paymentMethod, // 'razorpay' or 'cod'
      paymentStatus: orderPayload.paymentMethod === 'cod' ? 'pending_cod' : (orderPayload.paymentStatus || 'paid'),
      paymentDetails: orderPayload.paymentDetails || null,
      orderStatus: 'placed',
      courier: null,
      trackingNumber: null,
      statusHistory: [
        {
          status: 'placed',
          timestamp: now,
          note: orderPayload.paymentMethod === 'cod' ? 'Cash on Delivery order placed' : 'Payment confirmed via Razorpay',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Save to Firestore if connected
    if (isFirebaseConfigured() && db) {
      try {
        await setDoc(doc(db, 'orders', newOrder.id), newOrder);
      } catch (e) {
        console.warn('Firestore order save failed:', e);
      }
    }

    // Save locally
    const local = getLocalOrders();
    local.unshift(newOrder);
    saveLocalOrders(local);

    // Decrement stock and log inventory movements
    for (const item of newOrder.itemsSnapshot) {
      if (item.productId && item.variantId) {
        await productService.updateStock(item.productId, item.variantId, -item.quantity);
        await inventoryService.addLog({
          productId: item.productId,
          productName: item.productName,
          variantSize: item.variantSize,
          type: 'STOCK_OUT',
          quantity: -item.quantity,
          reason: `Order #${orderNumber} fulfillment`,
          staffName: 'Automated Checkout',
        });
      }
    }

    // Trigger confirmation email to customer & admin alert in background
    if (newOrder.customerSnapshot?.email) {
      emailService.sendOrderConfirmationEmail({
        to: newOrder.customerSnapshot.email,
        name: newOrder.customerSnapshot.name,
        order: newOrder,
      }).catch(err => console.warn('Order email notification error:', err));
    }
    emailService.sendAdminNewOrderAlert({ order: newOrder }).catch(err => console.warn('Admin alert email error:', err));

    return newOrder;
  },

  // Update order status (Admin)
  async updateOrderStatus(orderId, newStatus, extra = {}) {
    const orders = await this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    const statusEntry = {
      status: newStatus,
      timestamp: now,
      note: extra.note || `Order status updated to ${newStatus}`,
    };

    const updated = {
      orderStatus: newStatus,
      updatedAt: now,
      courier: extra.courier !== undefined ? extra.courier : order.courier,
      trackingNumber: extra.trackingNumber !== undefined ? extra.trackingNumber : order.trackingNumber,
      statusHistory: [...(order.statusHistory || []), statusEntry],
    };

    if (extra.paymentStatus) {
      updated.paymentStatus = extra.paymentStatus;
    }

    if (isFirebaseConfigured() && db) {
      try {
        await updateDoc(doc(db, 'orders', orderId), updated);
      } catch (e) {
        console.warn('Firestore update failed for order:', e);
      }
    }

    const local = getLocalOrders();
    const idx = local.findIndex(o => o.id === orderId);
    let finalOrder = { ...order, ...updated };
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updated };
      saveLocalOrders(local);
      finalOrder = local[idx];
    }

    // Send dispatch status email to patron
    if (finalOrder.customerSnapshot?.email) {
      emailService.sendOrderStatusUpdateEmail({
        to: finalOrder.customerSnapshot.email,
        name: finalOrder.customerSnapshot.name,
        orderNumber: finalOrder.orderNumber,
        status: newStatus,
        trackingNumber: finalOrder.trackingNumber,
      }).catch(err => console.warn('Status update email error:', err));
    }

    return finalOrder;
  },

  // Cancel order (Customer or Admin)
  async cancelOrder(orderId, reason = 'Customer requested cancellation') {
    return this.updateOrderStatus(orderId, 'cancelled', { note: reason });
  },
};
