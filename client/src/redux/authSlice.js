import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  allUsers: [],
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setAllUser: (state, action) => {
      state.allUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setUserProfilePic: (state, action) => {
      state.user.profile = action.payload;
    },
    userLogout: (state) => {
      state.user = null;
      state.allUsers = [];
      state.selectedUser = null;
    },
    updateUserStatus: (state, action) => {
      const { userId, isOnline } = action.payload;
      const user = state.allUsers.find((u) => u._id === userId);
      if (user) user.isOnline = isOnline;
    },
    updateUserChatMeta: (state, action) => {
  const { userId, lastMessage, time } = action.payload;
  const user = state.allUsers.find((u) => u._id === userId);
  if (user) {
    console.log("⚡ updateUserChatMeta chala", userId);
    user.lastMessage = lastMessage;
    user.lastMessageTime = time;

    // unread count increase kar do
    if (state.selectedUser?._id !== userId) {
      user.unreadCount = (user.unreadCount || 0) + 1;
    }
  }
},
    clearUnreadCount: (state, action) => {
      const userId = action.payload;
      const user = state.allUsers.find((u) => u._id === userId);
      if (user) user.unreadCount = 0;
    },
  },
});

export const {
  setUser,
  setUserProfilePic,
  setAllUser,
  setSelectedUser,
  userLogout,
  updateUserStatus,
  updateUserChatMeta,
  clearUnreadCount,
} = authSlice.actions;

export default authSlice.reducer;
