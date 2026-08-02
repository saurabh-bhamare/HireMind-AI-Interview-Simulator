import Interview from "../models/Interview.js";
import User from "../models/user.js";

import {
  extractResumeText
} from "../services/resumeParser.js";


import {
  analyzeResume,
  generateInterviewQuestions,
  generateFeedback,
  generateFinalInterviewReport
} from "../services/aiService.js";



// ==========================================
// UPLOAD RESUME
// ==========================================
export const uploadResume = async (req, res) => {

  try {

    console.log("========== UPLOAD RESUME ==========");


    if (!req.file) {

      return res.status(400).json({
        success:false,
        message:"Resume file not uploaded"
      });

    }


    const interview = await Interview.create({

      user:req.userId,

      resumeUrl:req.file.path,

      status:"uploaded",

      analysis:{}

    });



    console.log(
      "Interview Created:",
      interview._id
    );



    return res.status(201).json({

      success:true,

      interview

    });



  } catch(error){

    console.log(
      "UPLOAD RESUME ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });

  }

};




// ==========================================
// ANALYZE RESUME
// ==========================================
export const analyzeInterview = async(req,res)=>{

  try{


    const interview =
      await Interview.findById(req.params.id);



    if(!interview){

      return res.status(404).json({

        success:false,

        message:"Interview not found"

      });

    }



    interview.status="analyzing";

    await interview.save();



    console.log(
      "Extracting resume text..."
    );


    const resumeText =
      await extractResumeText(
        interview.resumeUrl
      );



    if(!resumeText || resumeText.length < 50){


      return res.status(400).json({

        success:false,

        message:"Unable to read resume content"

      });


    }



    console.log(
      "Sending resume to AI..."
    );



    const analysis =
      await analyzeResume(
        resumeText
      );



    interview.analysis = {

      name: analysis.name || "",

      email: analysis.email || "",

      phone: analysis.phone || "",

      summary: analysis.summary || "",

      skills: analysis.skills || [],

      certifications:
        analysis.certifications || [],


      projects:
        analysis.projects || [],


      experience:
        analysis.experience || [],


      education:
        analysis.education || []

    };



    interview.status="ready";


    await interview.save();




    return res.status(200).json({

      success:true,

      interview

    });



  }catch(error){


    console.log(
      "ANALYZE ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

};






// ==========================================
// CREATE INTERVIEW
// ==========================================
export const createInterview = async(req,res)=>{


try{


const {

  interviewId,

  role,

  experience,

  difficulty,

  interviewType


}=req.body;




const interview =
 await Interview.findById(interviewId);




if(!interview){


return res.status(404).json({

 success:false,

 message:"Interview not found"

});


}




const questions =
await generateInterviewQuestions(

 role,

 experience,

 difficulty,

 interviewType,

 interview.analysis

);





if(
 !Array.isArray(questions)
 ||
 questions.length===0
){


return res.status(500).json({

 success:false,

 message:"Question generation failed"

});


}




interview.jobRole = role;


interview.experience = experience;


interview.difficulty = difficulty;


interview.interviewType = interviewType;



interview.totalQuestions =
questions.length;



interview.status="started";





interview.questions =
questions.map((q)=>({


question:
 typeof q==="string"
 ? q
 : q.question,


userAnswer:"",


aiFeedback:{


score:0,

technical:0,

communication:0,

confidence:0,

strength:"",

weakness:"",

improvement:""

},


score:0,

technical:0,

communication:0,

confidence:0



}));





await interview.save();





return res.status(200).json({

success:true,

interview


});




}catch(error){


console.log(
"CREATE INTERVIEW ERROR:",
error
);



return res.status(500).json({

success:false,

message:error.message

});


}


};
// ==========================================
// GENERATE QUESTION
// ==========================================
export const generateQuestion = async (req, res) => {

  try {


    const interview =
      await Interview.findById(req.params.id);



    if (!interview) {

      return res.status(404).json({

        success:false,

        message:"Interview not found"

      });

    }



    const questions =
      await generateInterviewQuestions(

        interview.jobRole,

        interview.experience,

        interview.difficulty,

        interview.interviewType,

        interview.analysis

      );



    const question =
      questions[0] ||
      "Tell me about yourself.";





    interview.questions.push({

      question,

      userAnswer:"",

      aiFeedback:{


        score:0,

        technical:0,

        communication:0,

        confidence:0,

        strength:"",

        weakness:"",

        improvement:""

      },


      score:0,

      technical:0,

      communication:0,

      confidence:0


    });




    await interview.save();




    return res.status(200).json({

      success:true,

      question,

      interview


    });



  } catch(error){


    console.log(
      "GENERATE QUESTION ERROR:",
      error
    );



    return res.status(500).json({

      success:false,

      message:error.message

    });


  }

};







// ==========================================
// SUBMIT ANSWER
// ==========================================
export const submitAnswer = async(req,res)=>{


try{


const {

 answer,

 questionIndex


}=req.body;




const interview =
await Interview.findById(req.params.id);




if(!interview){


return res.status(404).json({

 success:false,

 message:"Interview not found"

});


}





const currentQuestion =
interview.questions[questionIndex];




if(!currentQuestion){


return res.status(400).json({

success:false,

message:"Question not found"

});


}




currentQuestion.userAnswer = answer;



let feedback;



try{


feedback =
await generateFeedback(

currentQuestion.question,

answer

);



}catch(error){



console.log(
"AI Feedback Error:",
error
);



feedback={


score:5,

technical:5,

communication:5,

confidence:5,

strength:
"Good attempt",


weakness:
"Need more detailed explanation",


improvement:
"Practice explaining concepts clearly"


};



}





currentQuestion.aiFeedback={


score:feedback.score || 0,

technical:feedback.technical || 0,

communication:
feedback.communication || 0,

confidence:
feedback.confidence || 0,


strength:
feedback.strength || "",


weakness:
feedback.weakness || "",


improvement:
feedback.improvement || ""


};





currentQuestion.score =
feedback.score || 0;


currentQuestion.technical =
feedback.technical || 0;


currentQuestion.communication =
feedback.communication || 0;


currentQuestion.confidence =
feedback.confidence || 0;







const totalScore =
interview.questions.reduce(

(sum,q)=>
sum + (q.score || 0),

0

);





if(interview.questions.length>0){


interview.overallScore =
Math.round(

(totalScore /
interview.questions.length)
*10

);


}







if(
questionIndex ===
interview.questions.length-1

){


interview.status="completed";


}





await interview.save();





return res.status(200).json({

success:true,

feedback,

interview


});





}catch(error){


console.log(
"SUBMIT ANSWER ERROR:",
error
);



return res.status(500).json({

success:false,

message:error.message

});


}


};








// ==========================================
// GET SINGLE INTERVIEW
// ==========================================
export const getInterviewById = async(req,res)=>{


try{


const interview =
await Interview.findById(req.params.id);




if(!interview){


return res.status(404).json({

success:false,

message:"Interview not found"

});


}



return res.status(200).json({

success:true,

interview

});




}catch(error){


return res.status(500).json({

success:false,

message:error.message

});


}


};








// ==========================================
// GET USER INTERVIEW HISTORY
// ==========================================
// ==========================================
// GET USER INTERVIEW HISTORY
// ==========================================
export const getUserInterviews = async (req, res) => {
  try {

    console.log("USER ID:", req.userId);


    const interviews = await Interview.find({
      user: req.userId,
      status: "completed"
    })
    .select(
      "jobRole experience difficulty interviewType overallScore report createdAt analysis"
    )
    .sort({
      createdAt: -1
    });



    console.log(
      "Completed Interviews:",
      interviews.length
    );



    return res.status(200).json({

      success:true,

      count: interviews.length,

      interviews

    });



  } catch(error){

    console.log(
      "GET HISTORY ERROR:",
      error
    );


    return res.status(500).json({

      success:false,

      message:error.message

    });

  }
};
// ==========================================
// GENERATE INTERVIEW REPORT
// ==========================================
export const generateInterviewReport = async (req, res) => {

  try {

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate report
    const report = await generateFinalInterviewReport(interview);

    if (!report) {
      return res.status(500).json({
        success: false,
        message: "Unable to generate AI report",
      });
    }

    // Deduct credits only once
    if (!interview.creditsDeducted) {

      if (user.credits < 5) {
        return res.status(400).json({
          success: false,
          message: "Not enough credits",
        });
      }

      user.credits -= 5;
      await user.save();

      interview.creditsDeducted = true;
    }

    // Always save report status
    interview.status = "completed";

interview.report = {
  ...report,
  generatedAt:new Date()
};

interview.completedAt = new Date();


await interview.save();



console.log(
 "REPORT SAVED FOR USER:",
 interview.user
);

    console.log("Interview Saved:");
    console.log(interview);

    return res.status(200).json({
      success: true,
      report,
    });

  } catch (error) {

    console.log("REPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};