const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const cors = require('cors')({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// Lazy load Razorpay instance with environment secrets
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID || functions.config().razorpay?.key_id;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;
  
  if (!keyId || !keySecret) {
    throw new Error('Razorpay credentials not configured in Cloud Functions environment.');
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

/**
 * Cloud Function: createRazorpayOrder
 * Calculates order price from trusted Firestore products, never trusting client amounts.
 */
exports.createRazorpayOrder = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { items, couponCode } = req.body;

      if (!items || !items.length) {
        return res.status(400).json({ error: 'Cart items are required.' });
      }

      // Recalculate price directly from trusted Firestore database
      let subtotal = 0;
      for (const item of items) {
        const prodDoc = await db.collection('products').doc(item.productId).get();
        if (!prodDoc.exists) {
          return res.status(404).json({ error: `Product not found: ${item.productId}` });
        }
        const prodData = prodDoc.data();
        const variant = prodData.variants?.find(v => v.id === item.variantId);
        const trustedPrice = variant ? (variant.discountPrice || variant.sellingPrice) : prodData.sellingPrice;
        subtotal += trustedPrice * item.quantity;
      }

      // Apply coupon if valid
      let discount = 0;
      if (couponCode) {
        const couponDoc = await db.collection('coupons').where('code', '==', couponCode.toUpperCase()).get();
        if (!couponDoc.empty) {
          const couponData = couponDoc.docs[0].data();
          if (couponData.active && (!couponData.minOrder || subtotal >= couponData.minOrder)) {
            if (couponData.type === 'percentage') {
              discount = Math.round((subtotal * couponData.value) / 100);
              if (couponData.maxDiscount) discount = Math.min(discount, couponData.maxDiscount);
            } else {
              discount = Math.min(couponData.value, subtotal);
            }
          }
        }
      }

      const shipping = subtotal >= 2499 ? 0 : 150;
      const totalAmount = Math.max(0, subtotal - discount + shipping);

      const rzp = getRazorpay();
      const options = {
        amount: Math.round(totalAmount * 100), // paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          itemCount: String(items.length),
        },
      };

      const rzpOrder = await rzp.orders.create(options);
      return res.status(200).json({
        razorpayOrderId: rzpOrder.id,
        amount: totalAmount,
        currency: 'INR',
      });
    } catch (err) {
      console.error('Error creating Razorpay order:', err);
      return res.status(500).json({ error: err.message });
    }
  });
});

/**
 * Cloud Function: verifyRazorpayPayment
 * Cryptographically verifies signature using HMAC SHA-256
 */
exports.verifyRazorpayPayment = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;
      const keySecret = process.env.RAZORPAY_KEY_SECRET || functions.config().razorpay?.key_secret;

      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== razorpaySignature) {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }

      // Mark order as paid in Firestore
      if (orderId) {
        await db.collection('orders').doc(orderId).update({
          paymentStatus: 'paid',
          orderStatus: 'confirmed',
          'paymentDetails.verifiedAt': admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
      console.error('Payment verification error:', err);
      return res.status(500).json({ error: err.message });
    }
  });
});

/**
 * Cloud Function: assignAdminRole
 * Trusted administrative function to assign privileged custom claims.
 */
exports.assignAdminRole = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.role === 'super_admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only Super Admins can assign roles.');
  }

  const { targetUid, role } = data;
  await admin.auth().setCustomUserClaims(targetUid, { role });
  await db.collection('users').doc(targetUid).update({ role });
  return { success: true, message: `Role ${role} assigned to user ${targetUid}` };
});
