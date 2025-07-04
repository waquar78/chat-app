import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    profile:{
        type:String
    },isOnline: {
        type: Boolean,
        default: false,
      },
      lastSeen: {
        type: Date,
      }
},{timestamps:true})

 const User=  mongoose.model("User",userSchema);
 export default User