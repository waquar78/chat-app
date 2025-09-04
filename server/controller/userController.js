import User from "../models/user.js"
import bcryptjs from "bcryptjs"
import { generateToken } from "../utils/generateToken.js"

export const register=async(req,res)=>{
   
    try {
        const {name,email,password}=req.body
        
       if(!name || !email || !password) {
          return res.status(400).json({
            message:"all field are require",
            success:false
          })
       }

       const user=await User.findOne({email});
       if(user){
        return res.status(400).json({
            message:"user alredy exist",
            success:false
        })
       }

       const hashPassword= await bcryptjs.hash(password,10)

       const newUser= User.create({
        name,
        email,
        password:hashPassword
       }) 
       return res.status(201).json({
        message:"account created successfull",
        success:true
       })

    } catch (error) {
        return res.status(500).json({
            message:"failed to register",
            success:false
        })
    }
}

//login

export const login = async (req,res)=>{
    try {
        const {email , password}=req.body

        if(!email || !password){
            return res.status(400).json({
                message:"all field are require",
                success:false
            })
        }

        const user=await User.findOne({email})
        if(!user){
            return res.status(400).json({
                message:"invalid email or password",
                success:false
            })
        }

        const isPasswordMatch= await bcryptjs.compare(password,user.password)
        if(!isPasswordMatch){
            return res.status(400).json({
                message:"invald email or password"
            })
        }
       generateToken(res,user,`login succussfull ${user.name}`);

    } catch (error) {
        return res.status(500).json({
            message:"failed to login",
            success: false
        })
    }
}

//logout

export const logout= async(req,res)=>{
    try {
        return res.status(200).cookie("token"," ",{maxAge:0}).json({
            success:true,
            message:"logout successfull"
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"logout failed",
            error:error.message

        })
    }
} 

//get all user list

export const getAllUsers= async(req,res)=>{
      try {
        const userId=req.user.userId
       const users= await User.find({_id:{$ne: userId}})

       return res.status(200).json({
        success:true,
        message:"all users has came",
        users
    })

      } catch (error) {
        res.status(500).json({ message: "Error fetching users", error : error.message});
      }
}

// upload profile and update user profile pic in DB
export const uploadProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    console.log("Uploaded file: ", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Profile picture not uploaded"
      });
    }

    const imgUrl = req.file.path || req.file.url;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile: imgUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture uploaded and updated successfully",
      profilePic: updatedUser.profile
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message
    });
  }
};
 