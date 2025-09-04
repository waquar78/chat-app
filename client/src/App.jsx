import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setUser, updateUserStatus, updateUserChatMeta } from "./redux/authSlice";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import EditProfile from "./components/EditProfile";
import socket from "./components/socket";
import { store } from "./Store/Store";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

 
<<<<<<< HEAD

=======
>>>>>>> e8a9ebda1cacfa69e9f184307c67fe6d0097cdec
  useEffect(() => {
    socket.on("update_user_status", ({ userId, isOnline }) => {
      dispatch(updateUserStatus({ userId, isOnline }));
    });

    socket.on("receive_message", (message) => {
      const selectedChat = store.getState().chat.selectedChat;
      if (selectedChat?._id !== message.chat) {
        dispatch(updateUserChatMeta({
          userId: message.sender._id,
          lastMessage: message.content,
          time: message.createdAt,
        }));
      }
    });

    return () => {
      socket.off("update_user_status");
      socket.off("receive_message");
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      socket.emit("user_online", user._id);
    }
  }, [user]);

  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/edit-profile" element={<EditProfile />} />
    </Routes>
  );
}

export default App;
