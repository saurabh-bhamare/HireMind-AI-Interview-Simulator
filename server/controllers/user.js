import User from "../models/user.js";


// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.userId)
      .select("-__v");


    if (!user) {
      return res.status(404).json({
        success:false,
        message:"User not found"
      });
    }


    res.status(200).json({
      success:true,
      user
    });


  } catch(error){

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Server Error"
    });

  }
};




// GET USER CREDITS
export const getUserCredits = async(req,res)=>{

try{

const user = await User.findById(req.userId);


if(!user){

return res.status(404).json({
success:false,
message:"User not found"
});

}


res.status(200).json({

success:true,
credits:user.credits

});


}
catch(error){

console.log(error);


res.status(500).json({

success:false,
message:"Server Error"

});

}

};





// UPDATE CREDITS
export const updateCredits = async(req,res)=>{

try{

const {credits}=req.body;


const user = await User.findById(req.userId);


if(!user){

return res.status(404).json({
message:"User not found"
});

}


user.credits = credits;


await user.save();



res.status(200).json({

success:true,
message:"Credits updated",
credits:user.credits

});


}
catch(error){

console.log(error);


res.status(500).json({

message:"Server Error"

});

}

};






// UPDATE PROFILE
export const updateProfile = async(req,res)=>{

try{


const user = await User.findById(req.userId);



if(!user){

return res.status(404).json({

success:false,

message:"User not found"

});

}



user.name = req.body.name || user.name;

user.email = req.body.email || user.email;



await user.save();



res.status(200).json({

success:true,

message:"Profile updated successfully",

user

});


}
catch(error){

console.log(error);


res.status(500).json({

success:false,

message:"Profile update failed"

});

}


};