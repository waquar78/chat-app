
import React, { useState, useEffect } from "react";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import ChatBox from "./ChatBox";
import { useSelector } from "react-redux";

const Home = () => {
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const loggedInUser = useSelector((state) => state.auth.user); // 👈 logged-in user check
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState("users"); // "users" | "ai"
  const [aiType, setAiType] = useState("normal");

  // When selectedChat changes
  useEffect(() => {
    if (selectedChat) {
      setShowChat(true);
      setActiveTab("users");
    }
  }, [selectedChat]);

  //  Set default tab to AI if user is logged out
  useEffect(() => {
    if (!loggedInUser) {
      setActiveTab("ai");
    }
  }, [loggedInUser]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div
        className={`w-full lg:w-[300px] bg-white border-r flex flex-col 
        ${showChat ? "hidden" : "flex"} lg:flex`}
      >
        <Header />
        <LeftSidebar
          setShowChat={setShowChat}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setAiType={setAiType}
        />
      </div>

      {/* ChatBox */}
      <div
        className={`flex-1 flex flex-col 
        ${showChat ? "flex" : "hidden"} lg:flex`}
      >
        <ChatBox
          setShowChat={setShowChat}
          aiType={aiType}
          isLoggedIn={!!loggedInUser} 
        />
      </div>
    </div>
  );
};

export default Home;
