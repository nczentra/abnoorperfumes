/**
 * AB Noor Perfumes - Client-side Email Service
 * Securely delegates email operations to the external backend server.
 * Never exposes the private Resend API key to client browsers.
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5000';

export const emailService = {
  /**
   * Helper to call backend email endpoints safely
   */
  async _callBackend(endpoint, payload) {
    try {
      const response = await fetch(`${BACKEND_URL}/api/emails/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.warn(`[Email Service] Backend ${endpoint} returned:`, errorData);
        return { success: false, error: errorData };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err) {
      // Graceful fallback for offline preview or before backend is deployed
      console.info(`[Email Service] External backend offline. Simulated email dispatch for ${endpoint}.`, payload);
      return { success: true, simulated: true };
    }
  },

  /**
   * 1. Send Welcome Email upon Account Creation
   */
  async sendWelcomeEmail({ to, name }) {
    return this._callBackend('welcome', { to, name });
  },

  /**
   * 2. Send Order Confirmation Email with Itemized Digital Invoice
   */
  async sendOrderConfirmationEmail({ to, name, order }) {
    return this._callBackend('order-confirmation', { to, name, order });
  },

  /**
   * 3. Send Dispatch / Shipping Status Update Email
   */
  async sendOrderStatusUpdateEmail({ to, name, orderNumber, status, trackingNumber }) {
    return this._callBackend('status-update', { to, name, orderNumber, status, trackingNumber });
  },

  /**
   * 4. Send Admin New Order Notification Alert
   */
  async sendAdminNewOrderAlert({ order }) {
    return this._callBackend('admin-alert', { order });
  },
};
