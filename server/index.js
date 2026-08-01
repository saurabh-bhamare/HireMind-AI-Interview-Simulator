import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDb from "./config/connectDb.js";

import authRoutes from "./routes/auth.js";
import interviewRoutes from "./routes/interview.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import webhookRoutes from "./routes/webhook.js";
import userRoutes from "./routes/user.js";


const app = express();

const PORT = process.env.PORT || 8000;


// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


// ===============================
// STRIPE WEBHOOK
// KEEP BEFORE express.json()
// ===============================

app.use(
  "/api/payment/webhook",
  webhookRoutes
);


// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// ===============================
// ROUTES
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/interview", interviewRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/user", userRoutes);


// ===============================
// TEST
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "HireMind API Running 🚀",
  });
});


// ===============================
// DATABASE + SERVER
// ===============================

connectDb()
.then(() => {

  const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
 console.log(`Server running on port ${PORT}`);
});

})
.catch((error) => {

  console.log(
    "❌ Database connection failed:",
    error.message
  );

});