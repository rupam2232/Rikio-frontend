import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import {Home} from './components/index.js'
import {Video} from "./components/index.js"
import Signup from './pages/Signup.page.jsx'
import Login from './pages/Login.page.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },{
        path: '/video/:videoId',
        element: <Video />,
      }
    ]
  },{
      path: '/signup',
      element: <Signup />,
  },{
    path: '/login',
    element: <Login />,
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position='top-right'/>
   </StrictMode>, 
)
