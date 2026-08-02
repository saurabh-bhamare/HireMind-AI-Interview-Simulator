import express from "express";


import {

  createInterview,
  generateQuestion,
  submitAnswer,
  getInterviewById,
  getUserInterviews,
  uploadResume,
  analyzeInterview,
  generateInterviewReport

} from "../controllers/interview.js";


import isAuth from "../middlewares/isauth.js";


import {
  upload
} from "../middlewares/upload.js";



const router = express.Router();




// ==================================
// RESUME UPLOAD
// ==================================

router.post(

  "/upload",

  isAuth,

  upload.single("resume"),

  uploadResume

);




// ==================================
// ANALYZE RESUME
// ==================================

router.post(

  "/analyze/:id",

  isAuth,

  analyzeInterview

);




// ==================================
// CREATE INTERVIEW
// ==================================

router.post(

  "/create",

  isAuth,

  createInterview

);




// ==================================
// GENERATE QUESTIONS
// ==================================

router.post(

  "/question/:id",

  isAuth,

  generateQuestion

);




// ==================================
// SUBMIT ANSWER
// ==================================

router.post(

  "/answer/:id",

  isAuth,

  submitAnswer

);





// ==================================
// INTERVIEW HISTORY
// IMPORTANT: KEEP ABOVE /:id
// ==================================

router.get(

  "/history",

  isAuth,

  getUserInterviews

);





// ==================================
// GENERATE REPORT
// ==================================

router.post(

  "/report/:id",

  isAuth,

  generateInterviewReport

);





// ==================================
// GET SINGLE INTERVIEW
// KEEP THIS AT LAST
// ==================================

router.get(

  "/:id",

  isAuth,

  getInterviewById

);



export default router;