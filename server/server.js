import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL ? [process.env.CLIENT_URL, 'http://localhost:5173', 'https://abnoorperfumes-cdb83.web.app', 'https://abnoorperfumes-cdb83.firebaseapp.com'] : '*',
  credentials: true,
}));
app.use(express.json());

// Initialize Resend
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'AB Noor Perfumes <onboarding@resend.dev>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'abnoorperfumes@gmail.com';

// Initialize Razorpay
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
const razorpay = (razorpayKeyId && razorpaySecret && !razorpayKeyId.includes('YourKey')) 
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpaySecret }) 
  : null;

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AB Noor Perfumes Secure External Backend',
    resendConfigured: Boolean(resend),
    razorpayConfigured: Boolean(razorpay),
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// 1. RAZORPAY PAYMENT ENDPOINTS (SERVER-SIDE)
// ==========================================

/**
 * Create Razorpay Order
 * Generates official order_id with currency INR and receipt tracking
 */
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid payment amount is required' });
    }

    // Convert amount in INR to Paise (multiply by 100)
    const amountInPaise = Math.round(Number(amount) * 100);

    if (razorpay) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        payment_capture: 1,
        notes: notes || {},
      };

      const order = await razorpay.orders.create(options);
      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: razorpayKeyId,
      });
    }

    // Fallback simulation for local development / testing without live keys
    const mockOrderId = `order_sim_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    res.json({
      success: true,
      orderId: mockOrderId,
      amount: amountInPaise,
      currency: 'INR',
      key: razorpayKeyId || 'rzp_test_luxury_ab_noor',
      simulated: true,
    });
  } catch (error) {
    console.error('[Razorpay Order Creation Error]:', error);
    res.status(500).json({ error: 'Failed to create payment order', details: error.message });
  }
});

/**
 * Verify Razorpay Signature (Cryptographic HMAC-SHA256)
 * Validates that payment was authenticated by Razorpay before marking order paid
 */
app.post('/api/payments/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return res.status(400).json({ error: 'Missing required payment verification parameters' });
    }

    if (razorpaySecret) {
      const generated_signature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature === razorpay_signature) {
        return res.json({
          verified: true,
          message: 'Payment verified securely with HMAC-SHA256 signature',
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
        });
      } else {
        return res.status(400).json({
          verified: false,
          error: 'Invalid payment signature. Potential tampering detected.',
        });
      }
    }

    // Fallback test verification when running in sandbox/preview
    res.json({
      verified: true,
      simulated: true,
      message: 'Payment verified (simulated without live secret)',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('[Payment Verification Error]:', error);
    res.status(500).json({ error: 'Payment signature verification failed', details: error.message });
  }
});

/**
 * Razorpay Webhook Endpoint
 * Handles asynchronous server-to-server notifications from Razorpay
 */
app.post('/api/payments/webhook', (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (webhookSecret && signature) {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  const event = req.body.event;
  console.log(`[Razorpay Webhook Event Received]: ${event}`);

  // Handle events: payment.captured, order.paid, payment.failed
  res.json({ received: true });
});

// ==========================================
// 2. RESEND TRANSACTIONAL EMAIL ENDPOINTS
// ==========================================

/**
 * Send Welcome Email to New Patron
 */
app.post('/api/emails/welcome', async (req, res) => {
  try {
    const { to, name } = req.body;
    if (!to) return res.status(400).json({ error: 'Recipient email is required' });

    const subject = `Welcome to the House of AB Noor Perfumes, ${name || 'Esteemed Patron'}`;
    const html = `
      <div style="font-family: Georgia, serif; background-color: #F8F5EF; padding: 24px; color: #171717;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #C6A15B; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #103B2D; padding: 36px 20px; text-align: center;">
            <div style="color: #C6A15B; font-size: 26px; letter-spacing: 4px; font-weight: bold;">AB NOOR PERFUMES</div>
            <div style="color: #E5D3A3; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px;">The Essence of Masculine Elegance</div>
          </div>
          <div style="padding: 32px 28px; line-height: 1.7;">
            <h2 style="color: #103B2D; margin-top: 0;">Welcome, ${name || 'Esteemed Patron'}</h2>
            <p>Your royal account has been created. As a distinguished member of AB Noor Perfumes, you enjoy priority reservations on rare vintage distillations, private extrait releases, and personal olfactory consultations.</p>
            <div style="background-color: #0B2119; color: #FFFFFF; padding: 18px; border-radius: 8px; text-align: center; margin: 24px 0; border: 1px solid #C6A15B;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #A0B2A6;">Inaugural Privilege</span><br/>
              <strong style="font-size: 22px; letter-spacing: 3px; color: #E5D3A3;">WELCOME10</strong>
              <div style="font-size: 11px; color: #D5C293; margin-top: 4px;">10% complimentary privilege on your inaugural flacon</div>
            </div>
            <p style="text-align: center;">
              <a href="https://abnoorperfumes-cdb83.web.app/shop" style="display: inline-block; background-color: #103B2D; color: #E5D3A3; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Explore Collection</a>
            </p>
          </div>
          <div style="background-color: #F8F5EF; padding: 20px; text-align: center; font-size: 11px; color: #777777; border-top: 1px solid #E5D3A3;">
            AB Noor Perfumes • Colaba Causeway, Mumbai 400005<br/>VIP Concierge: concierge@abnoorperfumes.com
          </div>
        </div>
      </div>
    `;

    if (resend) {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      });
      return res.json({ success: true, data });
    }

    res.json({ success: true, simulated: true, message: 'Welcome email simulated (Resend key not set)' });
  } catch (error) {
    console.error('[Welcome Email Error]:', error);
    res.status(500).json({ error: 'Failed to send welcome email', details: error.message });
  }
});

/**
 * Send Order Confirmation Email with Itemized Invoice
 */
app.post('/api/emails/order-confirmation', async (req, res) => {
  try {
    const { to, name, order } = req.body;
    if (!to || !order) return res.status(400).json({ error: 'Recipient and order details are required' });

    const subject = `Order Confirmed: ${order.orderNumber} - House of AB Noor Perfumes`;
    const itemsHtml = (order.itemsSnapshot || []).map(item => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #ECE7DE;">
          <strong style="color: #103B2D;">${item.productName}</strong><br/>
          <span style="font-size: 11px; color: #777777;">Size: ${item.variantSize || 'Standard'} • Qty: ${item.quantity}</span>
        </td>
        <td style="padding: 10px 0; text-align: right; border-bottom: 1px solid #ECE7DE; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Georgia, serif; background-color: #F8F5EF; padding: 24px; color: #171717;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #C6A15B; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #103B2D; padding: 32px 20px; text-align: center;">
            <div style="color: #C6A15B; font-size: 24px; letter-spacing: 4px; font-weight: bold;">AB NOOR PERFUMES</div>
            <div style="color: #E5D3A3; font-size: 10px; letter-spacing: 2px; text-transform: uppercase;">Official Flacon Acquisition Confirmation</div>
          </div>
          <div style="padding: 28px 24px; font-size: 13px; line-height: 1.6;">
            <h2 style="color: #103B2D; margin-top: 0;">Thank you, ${name || 'Esteemed Patron'}</h2>
            <p>Your order has been placed successfully and is being prepared in our climate-controlled vault. Sealed in our signature emerald presentation box.</p>
            <div style="background-color: #F8F5EF; border: 1px solid #E5D3A3; padding: 12px; border-radius: 8px; margin: 16px 0;">
              <strong>Order Reference:</strong> ${order.orderNumber}<br/>
              <strong>Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN')}<br/>
              <strong>Payment:</strong> ${order.paymentMethod?.toUpperCase()} (${order.paymentStatus})
            </div>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              ${itemsHtml}
              <tr>
                <td style="padding-top: 12px; font-weight: bold; color: #103B2D; font-size: 15px;">Total Paid:</td>
                <td style="padding-top: 12px; text-align: right; font-weight: bold; color: #103B2D; font-size: 15px;">₹${(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</td>
              </tr>
            </table>
            <p style="text-align: center; margin-top: 20px;">
              <a href="https://abnoorperfumes-cdb83.web.app/track-order?orderId=${order.orderNumber}" style="display: inline-block; background-color: #103B2D; color: #E5D3A3; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">Track Consignment</a>
            </p>
          </div>
        </div>
      </div>
    `;

    if (resend) {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      });
      return res.json({ success: true, data });
    }

    res.json({ success: true, simulated: true, message: 'Order confirmation simulated' });
  } catch (error) {
    console.error('[Order Email Error]:', error);
    res.status(500).json({ error: 'Failed to send order email', details: error.message });
  }
});

/**
 * Send Dispatch / Shipping Status Update Email
 */
app.post('/api/emails/status-update', async (req, res) => {
  try {
    const { to, name, orderNumber, status, trackingNumber } = req.body;
    if (!to || !orderNumber) return res.status(400).json({ error: 'Recipient and orderNumber required' });

    const subject = `Dispatch Update: Order ${orderNumber} is now ${status.toUpperCase()} - AB Noor Perfumes`;
    const html = `
      <div style="font-family: Georgia, serif; background-color: #F8F5EF; padding: 24px; color: #171717;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border: 1px solid #C6A15B; border-radius: 12px; overflow: hidden; padding: 24px;">
          <h2 style="color: #103B2D;">Dispatch Status Update</h2>
          <p>Esteemed Patron ${name || ''}, your order <strong>${orderNumber}</strong> has progressed in fulfillment:</p>
          <div style="background-color: #103B2D; color: #E5D3A3; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <span style="font-size: 11px; text-transform: uppercase; color: #FFF;">Current Stage</span><br/>
            <strong style="font-size: 18px; letter-spacing: 2px;">${status.toUpperCase()}</strong>
            ${trackingNumber ? `<div style="font-size: 12px; margin-top: 6px; color: #E5D3A3;">AWB: ${trackingNumber}</div>` : ''}
          </div>
          <p style="text-align: center;">
            <a href="https://abnoorperfumes-cdb83.web.app/track-order?orderId=${orderNumber}" style="display: inline-block; background-color: #C6A15B; color: #103B2D; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-size: 11px; font-weight: bold;">Track Live</a>
          </p>
        </div>
      </div>
    `;

    if (resend) {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      });
      return res.json({ success: true, data });
    }

    res.json({ success: true, simulated: true, message: 'Status update email simulated' });
  } catch (error) {
    console.error('[Status Update Email Error]:', error);
    res.status(500).json({ error: 'Failed to send status update email', details: error.message });
  }
});

/**
 * Admin Alert for New Orders
 */
app.post('/api/emails/admin-alert', async (req, res) => {
  try {
    const { order } = req.body;
    if (!order) return res.status(400).json({ error: 'Order details required' });

    const subject = `[Admin Alert] New Order Received: ${order.orderNumber} (₹${(order.totalAmount || order.total || 0).toLocaleString('en-IN')})`;
    const html = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #103B2D;">New Order Received on Store</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customerSnapshot?.name} (${order.customerSnapshot?.email})</p>
        <p><strong>Phone:</strong> ${order.customerSnapshot?.phone}</p>
        <p><strong>Total Value:</strong> ₹${(order.totalAmount || order.total || 0).toLocaleString('en-IN')}</p>
        <p><a href="https://abnoorperfumes-cdb83.web.app/admin/orders" style="display: inline-block; background-color: #103B2D; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px;">Open Store Admin Orders</a></p>
      </div>
    `;

    if (resend) {
      const data = await resend.emails.send({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject,
        html,
      });
      return res.json({ success: true, data });
    }

    res.json({ success: true, simulated: true, message: 'Admin alert simulated' });
  } catch (error) {
    console.error('[Admin Alert Error]:', error);
    res.status(500).json({ error: 'Failed to send admin alert', details: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[AB Noor Perfumes Backend] Running on port ${PORT}`);
  console.log(`[Resend Status] ${resend ? 'Active with API Key' : 'Simulated mode'}`);
  console.log(`[Razorpay Status] ${razorpay ? 'Active with Key & Secret' : 'Simulated mode'}`);
});
