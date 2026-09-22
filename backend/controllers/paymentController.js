import Stripe from "stripe";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

// @route   POST /api/payment/create-checkout-session
// @desc    Create a Stripe Checkout Session for the cart
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, customerEmail } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided for checkout" });
    }

    // Convert cart items into Stripe line items format
    const line_items = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: item.image && item.image.startsWith("http") ? [item.image] : [],
        },
        // Stripe expects unit amount in cents (e.g. $10.00 = 1000)
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.quantity || 1,
    }));

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: customerEmail || undefined,
      success_url: `${clientUrl}/cart?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/cart?payment_cancelled=true`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Stripe session creation error:", error);
    res.status(500).json({
      message: error.message || "Failed to initiate Stripe payment",
    });
  }
};