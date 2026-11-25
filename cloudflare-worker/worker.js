/**
 * AB Noor Perfumes - Cloudflare Worker for Resend Transactional Emails
 * 100% Serverless, Free Tier (100,000 req/day), Complies with Firebase Spark Plan.
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const DEFAULT_RESEND_KEY = 're_W74ruDJ1_Bg85A7cnQ4hfYbQxPueDKHwT';
const DEFAULT_FROM = 'AB Noor Perfumes <onboarding@resend.dev>';
const DEFAULT_ADMIN = 'abnoorperfumes@gmail.com';

export default {
  async fetch(request, env) {
    // 1. Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // 2. Healthcheck
    if (path === '/' || path === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'AB Noor Perfumes Cloudflare Email Worker',
        resendConfigured: true,
        timestamp: new Date().toISOString(),
      });
    }

    // 3. Email endpoints router
    const apiKey = env?.RESEND_API_KEY || DEFAULT_RESEND_KEY;
    const fromEmail = env?.RESEND_FROM_EMAIL || DEFAULT_FROM;
    const adminEmail = env?.ADMIN_EMAIL || DEFAULT_ADMIN;

    if (request.method === 'POST') {
      try {
        const body = await request.json();

        // ROUTE A: Welcome Email
        if (path === '/api/emails/welcome') {
          const { to, name } = body;
          if (!to) return jsonResponse({ error: 'Recipient email required' }, 400);

          const html = `
            <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; background: #070B14; color: #FFFFFF; padding: 40px 24px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #FFFFFF; font-size: 26px; letter-spacing: 4px; margin: 0;">AB NOOR</h1>
                <p style="color: #60A5FA; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 6px 0 0;">PERFUMES</p>
                <div style="width: 40px; height: 2px; background: #DC2626; margin: 16px auto 0;"></div>
              </div>
              <p style="font-size: 16px; color: #E2E8F0; line-height: 1.6;">Dear ${name || 'Gentleman Patron'},</p>
              <p style="font-size: 14px; color: #94A3B8; line-height: 1.7;">
                Welcome to the private sanctuary of <strong>AB Noor Perfumes</strong>. For generations, our house has distilled rare Cambodian agarwoods, cordovan saddle leathers, and royal pure attars for men of authority.
              </p>
              <div style="background: #0F2C59; border: 1px solid #2563EB; border-radius: 12px; padding: 20px; text-align: center; margin: 28px 0;">
                <p style="margin: 0; color: #93C5FD; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Your Welcome Privileges</p>
                <h2 style="margin: 8px 0 4px; color: #FFFFFF; font-size: 24px; letter-spacing: 3px;">WELCOME10</h2>
                <p style="margin: 0; color: #CBD5E1; font-size: 12px;">Enjoy 10% complimentary reduction on your maiden flacon.</p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://abnoorperfumes-cdb83.web.app/shop" style="display: inline-block; padding: 14px 32px; background: #DC2626; color: #FFFFFF; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; border-radius: 8px;">Explore Collections</a>
              </div>
            </div>
          `;

          const result = await sendWithResend(apiKey, {
            from: fromEmail,
            to: [to],
            subject: 'Welcome to AB Noor Perfumes | The Essence of Masculine Elegance',
            html,
          });

          return jsonResponse(result);
        }

        // ROUTE B: Order Confirmation
        if (path === '/api/emails/order-confirmation') {
          const { to, name, order } = body;
          if (!to || !order) return jsonResponse({ error: 'Order details required' }, 400);

          const itemsHtml = (order.items || order.itemsSnapshot || []).map(item => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #1E293B; color: #E2E8F0; font-size: 13px;">${item.name || item.productName} (${item.variantSize || item.size || 'Standard'}) x ${item.quantity}</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #1E293B; color: #FFFFFF; font-size: 13px; text-align: right; font-weight: bold;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
            </tr>
          `).join('');

          const html = `
            <div style="font-family: 'Playfair Display', Georgia, serif; max-width: 600px; margin: 0 auto; background: #070B14; color: #FFFFFF; padding: 40px 24px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #FFFFFF; font-size: 24px; letter-spacing: 4px; margin: 0;">AB NOOR</h1>
                <p style="color: #60A5FA; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; margin: 4px 0 0;">PERFUMES</p>
                <div style="width: 40px; height: 2px; background: #DC2626; margin: 12px auto 0;"></div>
              </div>
              <h2 style="color: #FFFFFF; font-size: 18px; margin-bottom: 8px;">Order Confirmed: #${order.orderNumber || order.id}</h2>
              <p style="color: #94A3B8; font-size: 13px; margin-top: 0;">Salutations ${name || 'Gentleman Patron'}, your order has been received and is being prepared in our climate vault.</p>
              
              <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
                <thead>
                  <tr style="border-bottom: 1px solid #334155;">
                    <th style="text-align: left; padding-bottom: 8px; color: #60A5FA; font-size: 11px; text-transform: uppercase;">Flacon</th>
                    <th style="text-align: right; padding-bottom: 8px; color: #60A5FA; font-size: 11px; text-transform: uppercase;">Amount</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>

              <div style="text-align: right; margin-top: 16px; border-top: 1px solid #334155; padding-top: 12px;">
                <p style="margin: 0; font-size: 16px; color: #FFFFFF;">Total: <strong style="color: #DC2626;">₹${(order.totalAmount || 0).toLocaleString('en-IN')}</strong></p>
              </div>

              <div style="margin-top: 30px; text-align: center;">
                <a href="https://abnoorperfumes-cdb83.web.app/track-order" style="display: inline-block; padding: 12px 28px; background: #2563EB; color: #FFFFFF; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 8px; text-transform: uppercase;">Track Consignment</a>
              </div>
            </div>
          `;

          const result = await sendWithResend(apiKey, {
            from: fromEmail,
            to: [to],
            subject: `Order Confirmed #${order.orderNumber || order.id} | AB Noor Perfumes`,
            html,
          });

          return jsonResponse(result);
        }

        // ROUTE C: Status Update Email
        if (path === '/api/emails/status-update') {
          const { to, name, orderNumber, status, trackingNumber } = body;
          if (!to || !orderNumber) return jsonResponse({ error: 'Order details required' }, 400);

          const html = `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #070B14; color: #FFFFFF; padding: 40px 24px; border-radius: 16px;">
              <h2 style="color: #FFFFFF; font-size: 20px;">Consignment Status: ${status?.toUpperCase()}</h2>
              <p style="color: #94A3B8; font-size: 14px;">Order #${orderNumber} status has been updated to <strong>${status}</strong>.</p>
              ${trackingNumber ? `<p style="color: #60A5FA; font-size: 13px;">Air Waybill / Tracking No: <strong>${trackingNumber}</strong></p>` : ''}
              <div style="margin-top: 24px;">
                <a href="https://abnoorperfumes-cdb83.web.app/track-order" style="display: inline-block; padding: 12px 24px; background: #DC2626; color: #FFFFFF; text-decoration: none; border-radius: 8px;">Track Consignment</a>
              </div>
            </div>
          `;

          const result = await sendWithResend(apiKey, {
            from: fromEmail,
            to: [to],
            subject: `Consignment Update: Order #${orderNumber} (${status}) | AB Noor Perfumes`,
            html,
          });

          return jsonResponse(result);
        }

        // ROUTE D: Admin Notification
        if (path === '/api/emails/admin-alert') {
          const { order } = body;
          const html = `
            <div style="font-family: sans-serif; padding: 20px; background: #F8FAFC;">
              <h2 style="color: #0F2C59;">👑 New Order Received: #${order?.orderNumber || order?.id}</h2>
              <p>Amount: <strong>₹${order?.totalAmount?.toLocaleString('en-IN')}</strong></p>
              <p>Customer: <strong>${order?.customerSnapshot?.name || 'Patron'}</strong> (${order?.customerSnapshot?.email || 'N/A'})</p>
              <p>Payment: <strong>${order?.paymentMethod} (${order?.paymentStatus})</strong></p>
              <a href="https://abnoorperfumes-cdb83.web.app/admin/orders" style="display: inline-block; padding: 10px 20px; background: #0F2C59; color: #FFF; text-decoration: none; border-radius: 6px;">Manage in Admin Portal</a>
            </div>
          `;

          const result = await sendWithResend(apiKey, {
            from: fromEmail,
            to: [adminEmail],
            subject: `[ADMIN ALERT] New Order Received #${order?.orderNumber || order?.id}`,
            html,
          });

          return jsonResponse(result);
        }

        return jsonResponse({ error: 'Endpoint not found' }, 404);
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    return jsonResponse({ error: 'Method not allowed' }, 405);
  },
};

async function sendWithResend(apiKey, emailData) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Resend API call failed');
  }
  return { success: true, data };
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json',
    },
  });
}
