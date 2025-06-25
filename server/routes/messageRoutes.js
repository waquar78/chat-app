import express from "express"
import { verifyToken } from "../utils/middleware.js"
import { deleteMessage, getAllMessageChat, sendMessage, updateMessage } from "../controller/messageController.js"

const router=express.Router()

router.route("/message").post(verifyToken,sendMessage);
router.route("/getmessages/:chatId").get(verifyToken,getAllMessageChat);
router.route("/delete/:messageId").delete(verifyToken, deleteMessage);
router.route("/update/:messageId").put(verifyToken, updateMessage);

export default router