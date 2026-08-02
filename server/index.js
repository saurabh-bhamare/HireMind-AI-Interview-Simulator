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


// CORS
app.use(
  cors({
    origin:[
      "http://localhost:5173",
      "hire-mind-ai-interview-simulator-ufht-9k24lgxvd-saurabh-1ebc.vercel.app"
    ],
    credentials:true
  })
);


// Stripe webhook
app.use(
  "/api/payment/webhook",
  webhookRoutes
);


// Body parser
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", userRoutes);


// Test
app.get("/",(req,res)=>{
 res.json({
  success:true,
  message:"HireMind API Running 🚀"
 });
});


connectDb()
.then(()=>{

 app.listen(PORT,()=>{
  console.log(`Server running on port ${PORT}`);
 });

})
.catch((error)=>{
 console.log(
  "❌ Database connection failed:",
  error.message
 );
});