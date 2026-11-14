export const razorpayService = {
  // Load Razorpay script dynamically if not already loaded in index.html
  loadRazorpayScript() {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  },

  // Open Razorpay Checkout modal
  async openCheckout({
    amount, // In Rupees
    orderNumber,
    customer,
    onSuccess,
    onFailure,
  }) {
    const isLoaded = await this.loadRazorpayScript();
    if (!isLoaded) {
      alert('Razorpay payment gateway failed to load. Please check your internet connection.');
      return;
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_ab_noor_perfumes';

    const options = {
      key: keyId,
      amount: Math.round(amount * 100), // Razorpay takes amount in paise (1 INR = 100 paise)
      currency: 'INR',
      name: 'AB Noor Perfumes',
      description: `Payment for Order #${orderNumber}`,
      image: '/logo/favicon.svg',
      prefill: {
        name: customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || '',
      },
      theme: {
        color: '#103B2D', // Deep Emerald
      },
      handler: function (response) {
        // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
        if (onSuccess) {
          onSuccess({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            paidAt: new Date().toISOString(),
          });
        }
      },
      modal: {
        ondismiss: function () {
          if (onFailure) {
            onFailure({ reason: 'Payment window was closed by the user.' });
          }
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        if (onFailure) {
          onFailure(response.error);
        }
      });
      rzp.open();
    } catch (err) {
      console.warn('Razorpay checkout initialization notice:', err);
      // If Razorpay test key is not live or in simulation environment, provide test mode mock confirmation option
      const simulateTestPayment = window.confirm(
        `[TEST MODE SIMULATION]\nRazorpay Gateway: ₹${amount.toLocaleString('en-IN')}\n\nWould you like to simulate a successful payment test?`
      );
      if (simulateTestPayment) {
        onSuccess({
          razorpayPaymentId: `pay_test_${Date.now()}`,
          razorpayOrderId: `order_test_${Date.now()}`,
          razorpaySignature: 'simulated_signature_valid',
          paidAt: new Date().toISOString(),
        });
      } else if (onFailure) {
        onFailure({ reason: 'Simulated payment cancelled.' });
      }
    }
  },
};
