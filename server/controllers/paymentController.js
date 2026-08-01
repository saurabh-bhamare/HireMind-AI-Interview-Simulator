import stripe from "../config/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { credits, price, userId, email } = req.body;

    if (!credits || !price || !userId) {
      return res.status(400).json({
        success: false,
        message: "Credits, price and userId are required",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      customer_email: email,

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${credits} HireMind Credits`,
              description: "AI Interview Simulator Credits",
            },
            unit_amount: Number(price) * 100,
          },
          quantity: 1,
        },
      ],

      mode: "payment",

      metadata: {
        userId: String(userId),
        credits: String(credits),
      },

      success_url: "http://localhost:5173/?payment=success",
      cancel_url: "http://localhost:5173/pricing",
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};