
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const BASE_URL = import.meta.env.VITE_MESSAGE_URL;


export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
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
