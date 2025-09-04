
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} from "../api/MessageApi";
import { setSelectedChat } from "../redux/chatSlice";
import { updateUserChatMeta } from "../redux/authSlice";
import socket from "./socket";
import { useChatWithAIMutation } from "../api/AiApi";

const ChatBox = ({ setShowChat }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const selectedAi = useSelector((state) => state.auth.selectedAi);
  const loggedInUser = useSelector((state) => state.auth.user);

  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [aiChats, setAiChats] = useState({});
  const [chatWithAI] = useChatWithAIMutation();

  const messagesEndRef = useRef(null);

  // API hooks for user chat
  const { data, isLoading, refetch } = useGetMessagesQuery(selectedChat?._id, {
    skip: !selectedChat,
  });

  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  // Join socket room for user chat
  useEffect(() => {
    if (selectedChat?._id) socket.emit("join_chat", selectedChat._id);
  }, [selectedChat]);

  // Socket listeners for user chat
  useEffect(() => {
    if (!selectedChat?._id) return;

    const handleReceive = (message) => {
      if (message.chat === selectedChat._id) refetch();
      else {
        dispatch(
          updateUserChatMeta({
            userId: message.sender._id,
            lastMessage: message.content,
            time: new Date().toISOString(),
          })
        );
      }
    };

    const handleDelete = ({ chatId }) => {
      if (chatId === selectedChat._id) refetch();
    };

    const handleUpdate = (message) => {
      if (message.chat === selectedChat._id) refetch();
    };

    socket.on("receive_message", handleReceive);
    socket.on("delete_message", handleDelete);
    socket.on("update_message", handleUpdate);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("delete_message", handleDelete);
      socket.off("update_message", handleUpdate);
    };
  }, [selectedChat, dispatch, refetch]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, aiChats, selectedAi]);

  // Send message handler
  const handleSend = async () => {
    if (!newMessage.trim()) return;

    if (!loggedInUser) return;

    if (selectedChat && selectedUser) {
      const res = await sendMessage({ chatId: selectedChat._id, content: newMessage }).unwrap();

      socket.emit("send_message", {
        ...res.data,
        sender: { _id: loggedInUser._id, name: loggedInUser.name },
      });

      dispatch(
        updateUserChatMeta({
          userId: selectedUser._id,
          lastMessage: newMessage,
          time: new Date().toISOString(),
        })
      );

      setNewMessage("");
    } else if (selectedAi) {
      const userMsg = { role: "user", content: newMessage };
      setAiChats((prev) => {
        const prevChat = prev[selectedAi.key] || [];
        return { ...prev, [selectedAi.key]: [...prevChat, userMsg] };
      });

      try {
        const res = await chatWithAI({ assistantType: selectedAi.key, text: newMessage }).unwrap();
        const botMsg = { role: "ai", content: res.reply };
        setAiChats((prev) => {
          const prevChat = prev[selectedAi.key] || [];
          return { ...prev, [selectedAi.key]: [...prevChat, botMsg] };
        });
      } catch (err) {
        console.error(err);
      }

      setNewMessage("");
    }
  };

  // Edit message
  const handleEdit = (msg) => {
    setEditingMessageId(msg._id);
    setEditContent(msg.content);
  };

  const handleUpdateMsg = async () => {
    if (!editContent.trim()) return;
    const res = await updateMessage({ messageId: editingMessageId, content: editContent }).unwrap();
    socket.emit("update_message", res.data);
    setEditingMessageId(null);
    setEditContent("");
  };

  // Delete message
  const handleDelete = async (id) => {
    await deleteMessage(id).unwrap();
    socket.emit("delete_message", { messageId: id, chatId: selectedChat._id });
  };

  const currentAiMessages = selectedAi ? aiChats[selectedAi.key] || [] : [];

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      {selectedChat && selectedUser ? (
        <div className="h-14 bg-white flex items-center px-4 border-b shadow-sm gap-4">
          <button
            onClick={() => {
              dispatch(setSelectedChat(null));
              setShowChat(false);
            }}
            className="lg:hidden"
          >
            <IoMdArrowRoundBack className="text-2xl text-gray-600" />
          </button>
          <div className="w-10">
            <img
              className="rounded-full"
              src={selectedUser?.profile || "https://sp.yimg.com/ib/th?id=OIP.iQ_xHoHL9myfw3KVWHJH6gHaLH&pid=Api"}
              alt="dp"
            />
          </div>
          <h2 className="font-semibold">{selectedUser.name}</h2>
        </div>
      ) : (
        <div className="h-14 bg-white flex items-center px-4 border-b shadow-sm gap-4">
          <button onClick={() => setShowChat(false)} className="lg:hidden">
            <IoMdArrowRoundBack className="text-2xl text-gray-600" />
          </button>
          <div className="w-10">
            <img className="rounded-full" src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="ai" />
          </div>
          <h2 className="font-semibold">{selectedAi ? selectedAi.label : "AI Assistant"}</h2>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3">
        {!loggedInUser && !selectedChat ? (
           <div className="flex items-center justify-center flex-col h-full">
            <h2 className="text-gray-400 text-lg mb-2">Welcome to the Quick_Chat!</h2>
          <p className="text-gray-500 text-2xl ">Please create an account or login to chat with users and AI.</p>
          </div>
        ) : selectedChat && selectedUser ? (
          isLoading ? (
            <p>Loading messages...</p>
          ) : data?.data.length > 0 ? (
            data.data.map((msg) => {
              const isSender = msg.sender._id === loggedInUser._id;
              return (
                <div key={msg._id} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                  <div className={`p-3 text-sm shadow ${isSender ? "bg-green-500 text-white rounded-2xl rounded-br-sm" : "bg-white text-gray-900 rounded-2xl rounded-bl-sm"}`} style={{ maxWidth: "70%", wordBreak: "break-word" }}>
                    {editingMessageId === msg._id ? (
                      <div>
                        <input value={editContent} onChange={(e) => setEditContent(e.target.value)} className="text-black p-1 rounded w-full mb-1" />
                        <button onClick={handleUpdateMsg} className="text-xs text-blue-600 mr-2">Save</button>
                        <button onClick={() => setEditingMessageId(null)} className="text-xs text-red-600">Cancel</button>
                      </div>
                    ) : (
                      <>
                        <p>{msg.content}</p>
                        <p className="text-[10px] text-gray-300 mt-1 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} | {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </p>
                        {isSender && (
                          <div className="flex justify-end mt-1 gap-2">
                            <button onClick={() => handleEdit(msg)} className="text-[11px] text-yellow-300">Edit</button>
                            <button onClick={() => handleDelete(msg._id)} className="text-[11px] text-red-300">Delete</button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No messages yet.</p>
          )
        ) : selectedAi ? (
          currentAiMessages.length > 0 ? (
            currentAiMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-3 text-sm shadow ${msg.role === "user" ? "bg-blue-500 text-white rounded-2xl rounded-br-sm" : "bg-gray-200 text-gray-900 rounded-2xl rounded-bl-sm"}`}>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Start chatting with {selectedAi.label}...</p>
          )
        ) : null}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="h-16 bg-white flex items-center px-4 border-t">
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="flex-1 border rounded-full px-4 py-2 outline-none" placeholder={!loggedInUser && !selectedChat ? "Please login to chat with users" : selectedChat && selectedUser ? "Type a message..." : selectedAi ? `Ask ${selectedAi.label}...` : "Select a chat"} />
        <button onClick={handleSend} disabled={!loggedInUser && !selectedChat} className="ml-3 bg-green-600 text-white px-5 py-2 rounded-full">Send</button>
      </div>
    </div>
  );
};

export default ChatBox;

