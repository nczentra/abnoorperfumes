import { orderService } from './orderService';
import { productService } from './productService';

export const reportService = {
  async getDashboardAnalytics() {
    const orders = await orderService.getOrders();
    const products = await productService.getProducts();

    let totalRevenue = 0;
    let todaySales = 0;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let cancelledOrders = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    orders.forEach(order => {
      const orderDate = (order.createdAt || '').split('T')[0];
      const amount = Number(order.totalAmount) || 0;

      if (order.orderStatus !== 'cancelled') {
        totalRevenue += amount;
        if (orderDate === todayStr) {
          todaySales += amount;
        }
      }

      if (order.orderStatus === 'pending' || order.orderStatus === 'placed' || order.orderStatus === 'processing') {
        pendingOrders += 1;
      } else if (order.orderStatus === 'delivered') {
        deliveredOrders += 1;
      } else if (order.orderStatus === 'cancelled') {
        cancelledOrders += 1;
      }
    });

    // Variant-level stock analysis
    let lowStockCount = 0;
    let outOfStockCount = 0;

    products.forEach(p => {
      (p.variants || []).forEach(v => {
        if (v.stock <= 0) {
          outOfStockCount += 1;
        } else if (v.stock <= (v.lowStockThreshold || 5)) {
          lowStockCount += 1;
        }
      });
    });

    // 7-day sales breakdown
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });

      const dayTotal = orders
        .filter(o => o.orderStatus !== 'cancelled' && (o.createdAt || '').startsWith(dateStr))
        .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

      const dayOrdersCount = orders.filter(o => (o.createdAt || '').startsWith(dateStr)).length;

      last7Days.push({
        date: dateStr,
        day: dayLabel,
        revenue: dayTotal,
        orders: dayOrdersCount,
      });
    }

    // Sales by Category
    const categorySalesMap = {};
    orders.forEach(order => {
      if (order.orderStatus !== 'cancelled') {
        (order.itemsSnapshot || []).forEach(item => {
          const product = products.find(p => p.id === item.productId);
          const cat = product?.categoryName || 'Arabian Fragrances';
          categorySalesMap[cat] = (categorySalesMap[cat] || 0) + (Number(item.price) * (item.quantity || 1));
        });
      }
    });

    const salesByCategory = Object.entries(categorySalesMap).map(([name, value]) => ({
      name,
      value,
    }));

    return {
      totalRevenue,
      todaySales,
      totalOrders: orders.length,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalProducts: products.length,
      lowStockCount,
      outOfStockCount,
      avgOrderValue: orders.length ? Math.round(totalRevenue / orders.length) : 0,
      recentOrders: orders.slice(0, 5),
      last7Days,
      salesByCategory,
    };
  },

  // Export orders to CSV string
  exportOrdersToCSV(orders) {
    const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Phone', 'Total Amount', 'Status', 'Payment Method'];
    const rows = orders.map(o => [
      `"${o.orderNumber || o.id}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customerSnapshot?.name || 'Guest'}"`,
      `"${o.customerSnapshot?.email || 'N/A'}"`,
      `"${o.customerSnapshot?.phone || 'N/A'}"`,
      o.totalAmount,
      `"${o.orderStatus}"`,
      `"${o.paymentMethod}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    return csvContent;
  },

  // Download CSV trigger
  downloadCSV(content, filename = 'ab-noor-orders.csv') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
