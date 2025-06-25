

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/message",
    credentials: "include",
  }),
  endpoints: (builder) => ({

    // kisi chat ke sare messages laane ke liye
    getMessages: builder.query({
      query: (chatId) => `/getmessages/${chatId}`,
    }),

    // message bhejne ke liye
    sendMessage: builder.mutation({
      query: (payload) => ({
        url: "/message",
        method: "POST",
        body: payload, // {chatId, content}
      }),
    }),
     deleteMessage: builder.mutation({
      query: (messageId) => ({
        url: `/delete/${messageId}`,
        method: "DELETE",
      }),
    }),
    updateMessage: builder.mutation({
      query: ({ messageId, content }) => ({
        url: `/update/${messageId}`,
        method: "PUT",
        body: { content },
      }),
    }),

  }),
});

export const { useGetMessagesQuery, useSendMessageMutation,useDeleteMessageMutation,useUpdateMessageMutation } = messageApi;
