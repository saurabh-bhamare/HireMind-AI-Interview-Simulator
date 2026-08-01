import express from "express";
import stripe from "../config/stripe.js";
import User from "../models/user.js";

const router = express.Router();


router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {

    const signature = req.headers["stripe-signature"];

    let event;


    try {

      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );


    } catch (error) {

      console.log(
        "❌ Webhook verification failed:",
        error.message
      );

      return res.status(400).send(
        `Webhook Error: ${error.message}`
      );

    }


    console.log(
      "✅ Stripe Event:",
      event.type
    );


    try {

      if (event.type === "checkout.session.completed") {


        const session = event.data.object;


        console.log(
          "Metadata:",
          session.metadata
        );


        const userId = session.metadata?.userId;

        const credits = Number(
          session.metadata?.credits || 0
        );


        if (!userId || !credits) {

          console.log(
            "❌ Missing userId or credits"
          );

          return res.json({
            received: true
          });

        }


        const user = await User.findById(userId);


        if (!user) {

          console.log(
            "❌ User not found"
          );

          return res.json({
            received: true
          });

        }


        console.log(
          "Before credits:",
          user.credits
        );


        user.credits += credits;


        await user.save();


        console.log(
          "✅ Credits added:",
          user.credits
        );

      }


      res.json({
        received: true
      });


    } catch (error) {

      console.log(
        "❌ Credit update error:",
        error.message
      );

      res.status(500).json({
        success:false,
        message:error.message
      });

    }

  }
);


export default router;