
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useGetAlluserQuery } from "../api/AuthApi";
import {
  setSelectedUser,
  setAllUser,
  clearUnreadCount,
  setSelectedAi,
} from "../redux/authSlice";
import { useCreateChatMutation } from "../api/ChatApi";
import { setSelectedChat } from "../redux/chatSlice";
import { FiSearch } from "react-icons/fi";
import socket from "./socket";

const LeftSidebar = ({ setShowChat, activeTab, setActiveTab }) => {
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading } = useGetAlluserQuery(null, { skip: !user });
  const users = useSelector((state) => state.auth.allUsers);
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const dispatch = useDispatch();
  const [createChat] = useCreateChatMutation();
  const [searchQuery, setSearchQuery] = useState("");

  //  Initial user list
  useEffect(() => {
    if (data) {
      const usersExceptMe = data.users.filter((u) => u._id !== user._id);
      dispatch(setAllUser(usersExceptMe));
    }
  }, [data, dispatch, user]);

  //  Socket listeners
  useEffect(() => {
    if (!user?._id) return;
    socket.emit("join", user._id);

    socket.on("userOnline", (userId) => {
      dispatch(
        setAllUser(
          users.map((u) =>
            u._id === userId ? { ...u, isOnline: true } : u
          )
        )
      );
    });

    socket.on("userOffline", (userId) => {
      dispatch(
        setAllUser(
          users.map((u) =>
            u._id === userId ? { ...u, isOnline: false } : u
          )
        )
      );
    });

    return () => {
      socket.off("userOnline");
      socket.off("userOffline");
    };
  }, [dispatch, user, users]);

  const sortedUsers = [...users].sort(
    (a, b) =>
      new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
  );

  const filteredUsers = sortedUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = async (u) => {
    dispatch(setSelectedAi(null)); //  AI chat close
    dispatch(setSelectedUser(u));
    dispatch(clearUnreadCount(u._id));
    const res = await createChat(u._id);
    if (res.data.success) {
      dispatch(setSelectedChat(res.data.chat));
      setShowChat(true);
    }
  };

  const handleAiClick = (model) => {
    dispatch(setSelectedUser(null));   //  user chat close
    dispatch(setSelectedChat(null));   //  normal chat close
    dispatch(setSelectedAi(model));    //  AI assistant select
    setShowChat(true);
  };

  const aiModels = [
    { key: "normal", label: "Normal AI" },
    { key: "coding", label: "Coding AI" },
    { key: "waquar", label: "Waquar AI" },
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* 🔍 Searchbar + Tabs */}
      <div className="p-3 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-2">
          <FiSearch className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>

        <div className="flex mt-3">
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "users"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex-1 py-2 text-sm font-medium ${
              activeTab === "ai"
                ? "border-b-2 border-green-500 text-green-600"
                : "text-gray-500"
            }`}
          >
            AI
          </button>
        </div>
      </div>

      {/* 👥 Users */}
      {activeTab === "users" &&
        (isLoading ? (
          <p className="p-4">Loading users...</p>
        ) : (
          filteredUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => handleUserClick(u)}
              className={`p-4 cursor-pointer border-b flex gap-4 items-center ${
                selectedUser?._id === u._id ? "bg-gray-200" : "hover:bg-gray-100"
              }`}
            >
              <div className="w-10 relative">
                <img
                  className="rounded-full"
                  src={
                    u.profile
                      ? u.profile
                      : "https://sp.yimg.com/ib/th?id=OIP.iQ_xHoHL9myfw3KVWHJH6gHaLH&pid=Api"
                  }
                  alt="dp"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${
                    u.isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
              </div>
              <div className="flex-1">
                <h3 className="font-medium flex items-center gap-2">
                  {u.name}
                  {u.unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {u.unreadCount}
                    </span>
                  )}
                </h3>
                {u.lastMessage && (
                  <p className="text-xs text-gray-500 truncate">
                    {u.lastMessage}
                  </p>
                )}
              </div>
            </div>
          ))
        ))}

      {/*  AI Models */}
      {activeTab === "ai" && (
        <div className="flex flex-col">
          {aiModels.map((model) => (
            <div
              key={model.key}
              onClick={() => handleAiClick(model)}
              className="p-4 cursor-pointer border-b hover:bg-gray-100 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-full font-bold uppercase">
                {model.label.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{model.label}</h3>
                <p className="text-xs text-gray-500">
                  Chat with {model.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeftSidebar;
