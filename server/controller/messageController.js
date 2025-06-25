import Chat from "../models/chat.js";
import Message from "../models/message.js";
import { getSocketInstance } from "../socket/socket.js";

//  Send Message
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.userId;
    const { chatId, content } = req.body;

    if (!chatId || !content) {
      return res.status(400).json({
        success: false,
        message: "chatId and content are required",
      });
    }

    const message = await Message.create({
      chat: chatId,
      sender: senderId,
      content,
    });

    await Chat.findByIdAndUpdate(chatId, { updatedAt: Date.now() });

    const io = getSocketInstance();
    io.to(chatId).emit("receive_message", message);

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// Get All Messages
export const getAllMessageChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    if (!chatId) {
      return res.status(400).json({
        success: false,
        message: "Chat ID not provided",
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "name profile isOnline")
      .sort({ createdAt: 1 });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No messages found for this chat",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      data: messages,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
};

//  Delete Message (with real-time emit)
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const deleted = await Message.findByIdAndDelete(messageId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    //  Socket emit for delete
    const io = getSocketInstance();
    io.to(deleted.chat.toString()).emit("delete_message", {
      messageId: deleted._id,
      chatId: deleted.chat.toString(),
    });

    return res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
      error: error.message,
    });
  }
};

//  Update Message (with real-time emit)
export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const updated = await Message.findByIdAndUpdate(
      messageId,
      { content },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Socket emit for update
    const io = getSocketInstance();
    io.to(updated.chat.toString()).emit("update_message", updated);

    return res.status(200).json({
      success: true,
      message: "Message updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update message",
      error: error.message,
    });
  }
};
