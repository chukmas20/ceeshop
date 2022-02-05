const User = require("../models/userModel")
const asyncHandler = require("express-async-handler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary");
const crypto = require("crypto");


// register user

exports.registerUser = asyncHandler(async(req,res)=>{

    const myCloud  = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        with: 150,
        crop: "scale",
    })

     const {name, email, password} = req.body;

     const user = await User.create({
         name, email,password,
         avatar:{
             public_id: myCloud.public_id,
             url: myCloud.secure_url
         }
     })

     sendToken(user,201,res);

})

// Login User
exports.loginUser = asyncHandler(async(req, res) => {
     const {email, password} = req.body

     if(!email || !password){
        return  res.status(400).json({
            success: false,
            message:"Please enter your email and password"
        })
     }

     const user = await User.findOne({email}).select("+password")
     if(!user){
        return  res.status(400).json({
            success: false,
            message:"User does not exist"
        })
     }
     const isPasswordMatched = await user.comparePassword(password);

     if (!isPasswordMatched) {
        return  res.status(401).json({
            success: false,
            message:"Invalid email or password"
        })
     }
   
     sendToken(user, 200, res);
})

// Logout
exports.logout = asyncHandler(async(req, res) =>{
    
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
})

//forgot password
exports.forgotPassword = asyncHandler(async(req,res)=>{
     const user = await User.findOne({email: req.body.email})

     if(!user){
         return res.status(404).json({
             success:false,
             message:"User not found"
         })
     }
     //get resetPassword token

     const resetToken = user.getResetPasswordToken();

     await user.save({validateBeforeSave: false});

    //  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
        const resetPasswordUrl = `${req.protocol}://${req.get(
        "host"
    )}/password/reset/${resetToken}`;

     const message = `Your password reset token is  :- \n\n ${resetPasswordUrl}
      \n\n Please ignore if you did not request this `;

      try {
          await sendEmail({
              email: user.email,
              subject: `Food shop password recovery`,
              message
          })
          res.status(200).json({
              success:true,
              message: `Email sent to ${user.email} successfully`
          })
      } catch (error) {
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;

          await user.save({validateBeforeSave: false});

          return res.status(500).json(error.message)

      }
})

//Reset password
exports.resetPassword = asyncHandler(async(req,res)=>{
  // creating token hash
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    })

    if(!user){
        return res.status(400).json({
            success:false,
            message:"reset password token is invalid or expired"
        })
    }
    if(req.body.password !== req.body.confirmPassword){
         return res.status(401).json({
             success:false,
             message:"Password does not match"
         })
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

// GET USER DETAIL
exports.getUserDetails = asyncHandler(async(req, res,next)=>{
    const user = await User.findById(req.user.id)

    res.status(200).json({
        success: true,
        user
    })
})

// Update USER Password
exports.updatePassword = asyncHandler(async(req, res,next)=>{
    const user = await User.findById(req.user.id).select("+password")

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
       return  res.status(400).json({
           success: false,
           message:"Old password is incorrect"
       })
    }
    if(req.body.newPassword !== req.body.confirmPassword){
        return  res.status(400).json({
            success: false,
            message:"Password does not match"
        }) 
    }
    user.password = req.body.newPassword

    await user.save()

   sendToken(user, 200, res)
})

// Update USER Profile
exports.updateProfile = asyncHandler(async(req, res)=>{
     const newUserData={
         name:req.body.name,
         email:req.body.email
     }

     if(req.body.avatar !== "") {
         const user = await User.findById(req.user.id)

         const imageId = user.avatar.public_id;

         await cloudinary.v2.uploader.destroy(imageId)

         const myCloud  = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            with: 150,
            crop: "scale",
        })

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
    
     }


     const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
         new:true,
         runValidators:true,
         useFindAndModify:false
     })

     res.status(200).json({
         success:true,
     })  
})

//get all users by admin

exports.getallUsers = asyncHandler(async(req, res)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users
    })
})

//get single user by admin

exports.getSingleUser = asyncHandler(async(req, res)=>{
     const user = await User.findById(req.params.id);
     if(!user){
         return res.json({
             success:false,
             message:`User does not exist with id: ${req.params.id}`
         })
     }
     res.status(200).json({
        success:true,
        user
    })
})

// //update User Role

// exports.updateUserRole = asyncHandler(async(req,res)=>{
//     const newUserData ={
//         name: req.body.name,
//         email:req.body.email,
//         role:req.body.role
//     }
//     const user = await User.findByIdAndUpdate(req.user.id, newUserData,{
//         new:true,
//         runValidators:true,
//         useFindAndModify:false
//     })

//     res.status(200).json({
//         success:true,
//     })  
// })

// update User Role -- Admin
exports.updateUserRole = asyncHandler(async (req, res, next) => {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
  
    await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
  
    res.status(200).json({
      success: true,
    });
  });

 //Delete User by (Admin)
exports.deleteUser = asyncHandler(async(req,res)=>{
   const user = await User.findById(req.params.id)   

   if(!user){
       return res.status(400).json({
           success:false,
           message:`user does not exist with id ${req.params.id}`
       })
   }

   const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

   await user.remove();

   res.status(200).json({
       sucess:true,
       message:"User successfully deleted"
   })
})

