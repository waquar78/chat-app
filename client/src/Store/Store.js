
import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import authReducer from "../redux/authSlice"
import chatReducer from "../redux/chatSlice"

import { AuthApi } from "../api/AuthApi"
import { chatApi } from "../api/ChatApi"
import { messageApi } from "../api/MessageApi"


const rootReducer = combineReducers({
  auth: authReducer,
  chat: chatReducer,
  [AuthApi.reducerPath]: AuthApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [messageApi.reducerPath]: messageApi.reducer
})


const persistConfig = {
  key: 'root',
  storage,
}


const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      AuthApi.middleware,
      chatApi.middleware,
      messageApi.middleware
    ),
})

export const persistor = persistStore(store)

 