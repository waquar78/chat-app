import React, { useState, useEffect } from "react";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import ChatBox from "./ChatBox";
import { useSelector } from "react-redux";

const Home = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (selectedChat) {
      setShowChat(true);
    }
  }, [selectedChat]);

  return (
    <div className="h-screen flex bg-gray-100">

      {/* Left Sidebar */}
      <div
        className={`w-full lg:w-[300px] bg-white border-r flex flex-col 
        ${showChat ? "hidden" : "flex"} lg:flex`}
      >
        <Header />
        <LeftSidebar setShowChat={setShowChat} />
      </div>

      {/* ChatBox */}
      <div
        className={`flex-1 flex flex-col 
        ${showChat ? "flex" : "hidden"} lg:flex`}
      >
        <ChatBox setShowChat={setShowChat} />
      </div>

    </div>
  );
};

export default Home;
