
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";


const BASE_URL = import.meta.env.VITE_CHAT_URL;

// yeh baseQuery bana ke rakha hai har API call ke liye
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include", 
  }),
  endpoints: (builder) => ({

    // chat create karne ke liye mutation
    createChat: builder.mutation({
      query: (receiverId) => ({
        url: "/create",
        method: "POST",
        body: { recieverId: receiverId },
      }),
    }),

    // login user ke sare chats lane ke liye
    getMyChats: builder.query({
      query: () => "/my-chats",
    }),

  }),
});

export const { useCreateChatMutation, useGetMyChatsQuery } = chatApi;
