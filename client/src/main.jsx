import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import {Toaster} from "react-hot-toast"
import { store ,persistor} from './Store/Store.js'
import { PersistGate } from 'redux-persist/integration/react'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    
<PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    <Toaster/>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
