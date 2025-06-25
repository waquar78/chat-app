
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
import {
  updateUserChatMeta,
} from "../redux/authSlice";
import socket from "./socket";

const ChatBox = ({ setShowChat }) => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const selectedChat = useSelector((state) => state.chat.selectedChat);
  const loggedInUser = useSelector((state) => state.auth.user);

  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [typingStatus, setTypingStatus] = useState("");
  const messagesEndRef = useRef(null);
  let typingTimeout;

  const { data, isLoading, refetch } = useGetMessagesQuery(selectedChat?._id, {
    skip: !selectedChat,
  });

  const [sendMessage] = useSendMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [updateMessage] = useUpdateMessageMutation();

  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("join_chat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!selectedChat?._id) return;

    const handleReceive = (message) => {
    
  console.log("📩 New message aaya:", message);
      
      if (message.chat === selectedChat._id) {
        refetch();
      } else {
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

    const handleTyping = ({ chatId, senderName }) => {
      if (chatId === selectedChat._id) setTypingStatus(`${senderName} is typing...`);
    };

    const handleStopTyping = ({ chatId }) => {
      if (chatId === selectedChat._id) setTypingStatus("");
    };

    socket.on("receive_message", handleReceive);
    socket.on("delete_message", handleDelete);
    socket.on("update_message", handleUpdate);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("delete_message", handleDelete);
      socket.off("update_message", handleUpdate);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [selectedChat, refetch, dispatch]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const res = await sendMessage({
      chatId: selectedChat._id,
      content: newMessage,
    });

    // socket emit for others
    socket.emit("send_message", {
      chat: selectedChat._id,
      content: newMessage,
      sender: { _id: loggedInUser._id, name: loggedInUser.name },
      createdAt: new Date().toISOString(),
      _id: res?.data?.data?._id,
    });

    // yaha add kiya hai sidebar update ke liye
    dispatch(
      updateUserChatMeta({
        userId: selectedUser._id,
        lastMessage: newMessage,
        time: new Date().toISOString(),
      })
    );

    setNewMessage("");

    socket.emit("stop_typing", {
      chatId: selectedChat._id,
      senderName: loggedInUser.name,
    });
  };

  const handleDelete = async (id) => {
    await deleteMessage(id);
  };

  const handleEdit = (msg) => {
    setEditingMessageId(msg._id);
    setEditContent(msg.content);
  };

  const handleUpdate = async () => {
    if (!editContent.trim()) return;
    await updateMessage({ messageId: editingMessageId, content: editContent });
    setEditingMessageId(null);
    setEditContent("");
  };

  if (!selectedChat || !selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        Select a chat to start messaging.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
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
            src={
              selectedUser?.profile
                ? selectedUser.profile
                : "https://sp.yimg.com/ib/th?id=OIP.iQ_xHoHL9myfw3KVWHJH6gHaLH&pid=Api"
            }
            alt="dp"
          />
        </div>
        <h2 className="font-semibold flex items-center gap-2">{selectedUser.name}</h2>
      </div>

      {/* {typingStatus && (
        <div className="text-xs text-gray-400 px-4 py-1">{typingStatus}</div>
      )} */}

      <div className="flex-1 overflow-y-auto px-4 py-3 bg-gray-50 space-y-3">
        {isLoading ? (
          <p>Loading messages...</p>
        ) : data?.data.length > 0 ? (
          data.data.map((msg) => {
            const isSender = msg.sender._id === loggedInUser._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isSender ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 text-sm shadow ${
                    isSender
                      ? "bg-green-500 text-white rounded-2xl rounded-br-sm"
                      : "bg-white text-gray-900 rounded-2xl rounded-bl-sm"
                  }`}
                  style={{ maxWidth: "70%", wordBreak: "break-word" }}
                >
                  {editingMessageId === msg._id ? (
                    <div>
                      <input
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="text-black p-1 rounded w-full mb-1"
                      />
                      <button
                        onClick={handleUpdate}
                        className="text-xs text-blue-600 mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMessageId(null)}
                        className="text-xs text-red-600"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p>{msg.content}</p>
                      <p className="text-[10px] text-gray-300 mt-1 text-right">
                        {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        |{" "}
                        {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      {isSender && (
                        <div className="flex justify-end mt-1 gap-2">
                          <button
                            onClick={() => handleEdit(msg)}
                            className="text-[11px] text-yellow-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(msg._id)}
                            className="text-[11px] text-red-300"
                          >
                            Delete
                          </button>
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
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="h-16 bg-white flex items-center px-4 border-t">
         {typingStatus && (
        <div className="text-xs text-gray-400 px-4 py-1">{typingStatus}</div>
      )}
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            socket.emit("typing", {
              chatId: selectedChat._id,
              senderName: loggedInUser.name,
            });
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
              socket.emit("stop_typing", {
                chatId: selectedChat._id,
                senderName: loggedInUser.name,
              });
            }, 1000);
          }}
          className="flex-1 border rounded-full px-4 py-2 outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="ml-3 bg-green-600 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
