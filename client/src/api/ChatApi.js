// src/api/chatApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// yeh baseQuery bana ke rakha hai har API call ke liye
export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/chat",
    credentials: "include", // taaki cookies bhi jaye (JWT token ke liye)
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
