import Chat from "../models/chat.js";

export const createChat = async (req, res) => {
    try {
        const { recieverId } = req.body;
        const  senderId  = req.user.userId

        if (!recieverId) {
            return res.status(400).json({
                success: false,
                message: "reciever id is required"
            })
        }
        //chat if already have done
        let chat = await Chat.findOne({
            participants: { $all: [recieverId, senderId] }
        })
        if (chat) {
            return res.status(200).json({
                success: true,
                message: "chat already exist",
                chat
            })
        }
        //create new chat
        chat = await Chat.create({
            participants: [recieverId, senderId]
        })
        return res.status(200).json({
            success: true,
            message: "new chat created",
            chat
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messsage: "failed to create chat",
            error: error.message
        })
    }
}

//show all chat of loggedin user 

export const userChat=async(req,res)=>{
    try {
        const userId=req.user.userId
        
        const chats= await Chat.find({
          participants:userId
        })
        .populate("participants","name profile isOnline")
       .sort({updatedAt:-1});
       return res.status(200).json({
         success:true,
         message:"chat fetched successfully",
         chats
       })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch chats",
            error: error.message,
          });
    }
} 