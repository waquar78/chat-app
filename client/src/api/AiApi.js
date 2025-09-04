// src/api/AiApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiApi = createApi({
  reducerPath: "aiApi",   
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_AI_URL }),
  endpoints: (builder) => ({
    chatWithAI: builder.mutation({
      query: ({ assistantType, text }) => ({
        url: "/chat",
        method: "POST",
        body: { assistantType, text }
      })
    })
  })
});

export const { useChatWithAIMutation } = aiApi;
