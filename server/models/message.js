import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  content:{
    type:String,
  },
  chat:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Chat"
  },
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},  { timestamps: true })

const Messsage=mongoose.model("Message",messageSchema)
export default Messsage 