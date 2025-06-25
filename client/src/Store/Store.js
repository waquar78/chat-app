// import {configureStore} from "@reduxjs/toolkit"
// import { AuthApi } from "../api/AuthApi"
// import authReducer from "../redux/authSlice.js"
// import chatReducer from "../redux/chatSlice.js"
// import { chatApi } from "../api/ChatApi.js"
// import { messageApi } from "../api/MessageApi.js"

// export const store=configureStore({
//     reducer:{
//       auth:authReducer,
//       chat:chatReducer,
//       [AuthApi.reducerPath]:AuthApi.reducer,
//       [chatApi.reducerPath]:chatApi.reducer,
//       [messageApi.reducerPath]:messageApi.reducer
//     },
//     middleware:(getDefautlmiddleware)=>
//         getDefautlmiddleware().concat(AuthApi.middleware,messageApi.middleware,chatApi.middleware)
    
// })

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

//  2️⃣ persist config banao
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

 