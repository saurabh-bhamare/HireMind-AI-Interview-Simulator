import express from "express";

import {
  getUserProfile,
  getUserCredits,
  updateCredits,
  updateProfile
} from "../controllers/user.js";


import isAuth from "../middlewares/isauth.js";


const router = express.Router();



router.get(
  "/profile",
  isAuth,
  getUserProfile
);



router.get(
  "/credits",
  isAuth,
  getUserCredits
);



router.put(
  "/credits",
  isAuth,
  updateCredits
);



router.put(
  "/profile",
  isAuth,
  updateProfile
);



export default router;