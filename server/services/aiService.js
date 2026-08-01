import Groq from "groq-sdk";


// ==========================================
// GROQ CLIENT
// ==========================================

const getGroq = () => {

  return new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

};



// ==========================================
// MODELS
// ==========================================

const PRIMARY_MODEL = "llama-3.3-70b-versatile";

const FALLBACK_MODEL = "llama-3.1-8b-instant";



// ==========================================
// HELPERS
// ==========================================

const sleep = (ms) =>
  new Promise(resolve => setTimeout(resolve, ms));



const cleanJSON = (text)=>{

  return text
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim();

};



// ==========================================
// COMMON GROQ CALL
// ==========================================

const callGroq = async(
  messages,
  temperature = 0.3
)=>{

  const groq = getGroq();


  try {


    console.log(
      "Using model:",
      PRIMARY_MODEL
    );


    const completion =
      await groq.chat.completions.create({

        model: PRIMARY_MODEL,

        temperature,

        messages

      });



    return completion
      .choices[0]
      .message
      .content;



  }
  catch(error){


    console.log(
      "Primary model failed:",
      error.message
    );



    if(
      error?.status === 429 ||
      error?.error?.error?.code === "rate_limit_exceeded"
    ){


      console.log(
        "Switching to fallback model..."
      );



      await sleep(1000);



      const completion =
        await groq.chat.completions.create({

          model:FALLBACK_MODEL,

          temperature,

          messages

        });



      return completion
        .choices[0]
        .message
        .content;


    }



    throw error;


  }


};





// =================================================
// RESUME ANALYSIS
// =================================================

export const analyzeResume = async(resumeText)=>{


try{


const prompt = `

You are an expert ATS Resume Analyzer.


Analyze this resume.


Return ONLY valid JSON.


Format:

{
"name":"",
"email":"",
"phone":"",
"summary":"",

"skills":[],

"certifications":[],

"projects":[
{
"title":"",
"description":"",
"technologies":[]
}
],

"experience":[
{
"company":"",
"role":"",
"duration":""
}
],

"education":[
{
"degree":"",
"institution":"",
"cgpa":""
}
]

}



Resume:

${resumeText}

`;



let text =
await callGroq(
[
{
role:"user",
content:prompt
}
],
0.2
);



text = cleanJSON(text);



return JSON.parse(text);



}
catch(error){


console.log(
"Resume Analysis Error:",
error.message
);



return {

name:"",
email:"",
phone:"",
summary:"",
skills:[],
certifications:[],
projects:[],
experience:[],
education:[]

};


}

};






// =================================================
// GENERATE INTERVIEW QUESTIONS
// =================================================


export const generateInterviewQuestions = async(
role,
experience,
difficulty,
interviewType,
analysis
)=>{


try{


const prompt = `


You are a Senior Technical Interviewer.



Generate EXACTLY 10 interview questions.



Candidate Role:

${role}



Experience:

${experience}



Interview Type:

${interviewType}



Difficulty:

${difficulty}




Skills:

${analysis?.skills?.join(", ")}



Projects:


${
analysis?.projects?.map(
p=>`

Project:
${p.title}

Description:
${p.description}

Technologies:
${p.technologies?.join(", ")}

`
).join("\n")
}




Rules:

- Resume based questions
- Project based questions
- Technical questions
- Practical questions
- Suitable for candidate level


Return ONLY JSON.



Format:

{
"questions":[

"Question 1",
"Question 2",
"Question 3",
"Question 4",
"Question 5",
"Question 6",
"Question 7",
"Question 8",
"Question 9",
"Question 10"

]

}


`;



let text =
await callGroq(
[
{
role:"user",
content:prompt
}
],
0.6
);



text = cleanJSON(text);



return JSON.parse(text).questions;



}
catch(error){


console.log(
"Question Generation Error:",
error.message
);



return [

"Tell me about yourself.",

"Explain your project.",

"Explain React lifecycle.",

"What is Node.js?",

"What is MongoDB?",

"Explain REST API.",

"What is JWT?",

"What is middleware?",

"Explain promises in JavaScript.",

"Why should we hire you?"

];


}

};
// =================================================
// ANSWER FEEDBACK
// =================================================


export const generateFeedback = async(
question,
answer
)=>{


try{


const prompt = `


You are an expert technical interviewer.



Evaluate candidate answer.



Question:

${question}



Candidate Answer:

${answer}



Return ONLY valid JSON.



Format:


{

"score":0,

"technical":0,

"communication":0,

"confidence":0,


"strength":"",

"weakness":"",

"improvement":""

}



Rules:

- Score between 1-10
- Evaluate technical correctness
- Evaluate communication
- Evaluate confidence
- Give improvement suggestions


`;



let text =
await callGroq(
[
{
role:"user",
content:prompt
}
],
0.3
);



text = cleanJSON(text);



return JSON.parse(text);



}
catch(error){


console.log(
"Feedback Error:",
error.message
);



return {

score:5,

technical:5,

communication:5,

confidence:5,

strength:"Good attempt",

weakness:"Need more detailed explanation",

improvement:"Practice explaining concepts clearly"

};


}


};








// =================================================
// FINAL INTERVIEW REPORT
// =================================================


export const generateFinalInterviewReport = async(interview)=>{


try{


const qa =

interview.questions.map(
(q,index)=>`

Question ${index+1}

${q.question}


Candidate Answer:

${q.userAnswer || "No Answer"}



Score:

${q.score}


Technical:

${q.technical}


Communication:

${q.communication}


Confidence:

${q.confidence}


`
).join("\n");





const prompt = `


You are a Senior Technical Interviewer.



Analyze this complete interview.



Candidate:

${interview.analysis?.name || "Candidate"}



Role:

${interview.jobRole}



Experience:

${interview.experience}



Interview Type:

${interview.interviewType}



Difficulty:

${interview.difficulty}



Interview Data:


${qa}



Return ONLY valid JSON.



FORMAT:


{

"candidate":{

"name":"",
"role":"",
"experience":"",
"interviewType":"",
"date":"",
"duration":""

},


"overallScore":0,

"technical":0,

"communication":0,

"confidence":0,

"problemSolving":0,

"grammar":0,

"fluency":0,

"atsScore":0,


"performanceLevel":"",


"hiringRecommendation":"",


"feedback":"",


"strengths":[],

"weaknesses":[],

"recommendations":[],


"answers":[

{

"question":"",

"answer":"",

"score":0,

"expectedAnswer":"",

"feedback":"",

"mistakes":"",

"improvement":""

}

]


}



Rules:

- Analyze every answer
- Give realistic scores
- Find technical mistakes
- Check communication quality
- Give hiring recommendation
- Provide improvement plan


`;



let text =
await callGroq(
[
{
role:"user",
content:prompt
}
],
0.3
);



text = cleanJSON(text);



return JSON.parse(text);



}
catch(error){


console.log(
"Final Report Error:",
error.message
);


return null;


}


};