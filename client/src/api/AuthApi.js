import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setAllUser, setUser, userLogout,setUserProfilePic } from '../redux/authSlice';

//  Env variable se base URL le rahe hain
const BASE_URL = import.meta.env.VITE_USER_URL;
;

export const AuthApi = createApi({
  reducerPath: 'AuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    // Register User
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: '/register',
        method: 'POST',
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Login User
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: '/login',
        method: 'POST',
        body: inputData,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data.user));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Logout User
    logoutUer: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(userLogout());
        } catch (error) {
          console.log(error);
        }
      },
    }),
 
    // Get All Users
    getAlluser: builder.query({
      query: () => ({
        url: '/users',
        method: 'GET',
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAllUser(data.users));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    // Upload Profile Picture
    uploadProfilePic: builder.mutation({
      query: (formData) => ({
        url: "/upload",
        method: "POST",
        body: formData,
      }),
      async onQueryStarted(_, { queryFulfilled ,dispatch}) {
        try {
          const { data } = await queryFulfilled;
          console.log("Profile updated successfully:", data);
           dispatch(setUserProfilePic(data.profilePic));
        } catch (error) {
          console.log("Upload failed:", error);
        }
      },
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUerMutation,
  useGetAlluserQuery,
  useUploadProfilePicMutation
} = AuthApi;
