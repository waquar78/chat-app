import express from "express"
import { createChat, userChat } from "../controller/chatController.js"
import { verifyToken } from "../utils/middleware.js"

const router=express.Router()

router.route("/create").post(verifyToken,createChat),
router.route("/my-chats").get(verifyToken,userChat)

export default router 