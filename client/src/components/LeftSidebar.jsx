import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useGetAlluserQuery } from "../api/AuthApi";
import { setSelectedUser, setAllUser, clearUnreadCount } from "../redux/authSlice";
import { useCreateChatMutation } from "../api/ChatApi";
import { setSelectedChat } from "../redux/chatSlice";
import { FiSearch } from "react-icons/fi";
import socket from "./socket";

const LeftSidebar = ({ setShowChat }) => {   // prop mil raha ab
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading } = useGetAlluserQuery(null, { skip: !user });
  const users = useSelector((state) => state.auth.allUsers);
  console.log("🔥 LeftSidebar render ho raha", users);
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const [createChat] = useCreateChatMutation();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (data) {
      console.log("🔥 All Users Data from backend:", data.users); // 👈 yeh line daal
      const usersExceptMe = data.users.filter((u) => u._id !== user._id);
      dispatch(setAllUser(usersExceptMe));

    }
  }, [data, dispatch]);


  const sortedUsers = [...users].sort((a, b) =>
    new Date(b.lastMessageTime || 0) - new Date(a.lastMessageTime || 0)
  );

  const filteredUsers = sortedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = async (user) => {
    dispatch(setSelectedUser(user));
    dispatch(clearUnreadCount(user._id));
    const res = await createChat(user._id);
    if (res.data.success) {
      dispatch(setSelectedChat(res.data.chat));
      setShowChat(true); // 👈 yaha chalega ab bina error
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
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
      </div>

      {isLoading ? (
        <p className="p-4">Loading users...</p>
      ) : (
        filteredUsers.map((user) => (
          <div
            key={user._id}
            onClick={() => handleUserClick(user)}
            className={`p-4 cursor-pointer border-b flex gap-4 items-center ${selectedUser?._id === user._id
                ? "bg-gray-200"
                : "hover:bg-gray-100"
              }`}
          >
            <div className="w-10 relative">
              <img
                className="rounded-full"
                src={
                  user.profile
                    ? user.profile
                    : "https://sp.yimg.com/ib/th?id=OIP.iQ_xHoHL9myfw3KVWHJH6gHaLH&pid=Api"
                }
                alt="dp"
              />
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${user.isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
              ></span>
            </div>

            <div className="flex-1">
              <h3 className="font-medium flex items-center gap-2">
                {user.name}
                {user.unreadCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {user.unreadCount}
                  </span>
                )}
              </h3>
              {user.lastMessage && (
                <p className="text-xs text-gray-500 truncate">{user.lastMessage}</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default LeftSidebar;
