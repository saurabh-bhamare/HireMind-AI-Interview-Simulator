import mongoose from "mongoose";


const interviewSchema = new mongoose.Schema(
{
  // ===========================
  // USER
  // ===========================
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },


  // ===========================
  // RESUME
  // ===========================
  resumeUrl:{
    type:String,
    default:""
  },


  // ===========================
  // JOB DETAILS
  // ===========================
  jobRole:{
    type:String,
    default:""
  },

  company:{
    type:String,
    default:""
  },


  experience:{
    type:String,
    default:""
  },


  interviewType:{
    type:String,
    enum:[
      "Technical",
      "HR",
      "Behavioral",
      "Mixed"
    ],
    default:"Technical"
  },


  difficulty:{
    type:String,
    enum:[
      "Easy",
      "Medium",
      "Hard"
    ],
    default:"Medium"
  },


  // ===========================
  // STATUS
  // ===========================
  status:{
    type:String,
    enum:[
      "created",
      "uploaded",
      "analyzing",
      "ready",
      "started",
      "completed"
    ],
    default:"created"
  },



  // ===========================
  // AI RESUME ANALYSIS
  // ===========================
  analysis:{


    name:{
      type:String,
      default:""
    },


    email:{
      type:String,
      default:""
    },


    phone:{
      type:String,
      default:""
    },


    summary:{
      type:String,
      default:""
    },


    skills:{
      type:[String],
      default:[]
    },


    certifications:{
      type:[String],
      default:[]
    },


    projects:[
      {
        title:{
          type:String,
          default:""
        },

        description:{
          type:String,
          default:""
        },

        technologies:{
          type:[String],
          default:[]
        }
      }
    ],



    experience:[
      {
        company:{
          type:String,
          default:""
        },

        role:{
          type:String,
          default:""
        },

        duration:{
          type:String,
          default:""
        }
      }
    ],



    education:[
      {
        degree:{
          type:String,
          default:""
        },

        institution:{
          type:String,
          default:""
        },

        cgpa:{
          type:String,
          default:""
        }
      }
    ]

  },



  // ===========================
  // INTERVIEW QUESTIONS
  // ===========================
  questions:[
    {


      question:{
        type:String,
        required:true
      },


      userAnswer:{
        type:String,
        default:""
      },



      // AI feedback for individual answer
      aiFeedback:{


        score:{
          type:Number,
          default:0
        },


        technical:{
          type:Number,
          default:0
        },


        communication:{
          type:Number,
          default:0
        },


        confidence:{
          type:Number,
          default:0
        },


        strength:{
          type:String,
          default:""
        },


        weakness:{
          type:String,
          default:""
        },


        improvement:{
          type:String,
          default:""
        }

      },



      score:{
        type:Number,
        default:0
      },


      technical:{
        type:Number,
        default:0
      },


      communication:{
        type:Number,
        default:0
      },


      confidence:{
        type:Number,
        default:0
      }

    }
  ],




  // ===========================
  // FINAL AI REPORT DATA
  // ===========================


  overallScore:{
    type:Number,
    default:0
  },


  technicalScore:{
    type:Number,
    default:0
  },


  communicationScore:{
    type:Number,
    default:0
  },


  confidenceScore:{
    type:Number,
    default:0
  },


  problemSolvingScore:{
    type:Number,
    default:0
  },


  grammarScore:{
    type:Number,
    default:0
  },


  fluencyScore:{
    type:Number,
    default:0
  },


  atsScore:{
    type:Number,
    default:0
  },



  performanceLevel:{
    type:String,
    default:""
  },



  hiringRecommendation:{
    type:String,
    default:""
  },



  finalFeedback:{
    type:String,
    default:""
  },



  totalQuestions:{
    type:Number,
    default:0
  },


  interviewDuration:{
    type:Number,
    default:0
  },
  creditsDeducted: {
  type: Boolean,
  default: false,
},


},
{
 timestamps:true
}
);



const Interview =
mongoose.models.Interview ||
mongoose.model("Interview",interviewSchema);



export default Interview;