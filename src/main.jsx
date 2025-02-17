import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { AuthLayout, ChannelWrapper } from './components/index.js'

import Home from './pages/Home.page.jsx'
import Signup from './pages/Signup.page.jsx'
import Login from './pages/Login.page.jsx'
import Video from './pages/Video.page.jsx'
import UploadVideo from './pages/UploadVideo.page.jsx'
import Dashboard from './pages/Dashboard.page.jsx'
import PlaylistVideo from './pages/PlaylistVideo.page'
import NotFound from './pages/NotFound.page.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        path: '/',
        element: <Home />
      }, {
        path: '/liked-videos',
        element: <NotFound />
      }, {
        path: '/watch-history',
        element: <NotFound />
      }, {
        path: '/collections',
        element: <NotFound />
      }, {
        path: '/subscribed',
        element: <NotFound />
      }, {
        path: '/settings',
        element: <NotFound />
      }, {
        path: '/dashboard',
        element: (
          <AuthLayout >
            <Dashboard />
          </AuthLayout>
        )
      }, {
        path: '/video/:videoId',
        element: <Video />,
      }, {
        path: '/upload',
        element: (
          <AuthLayout >
            <UploadVideo />
          </AuthLayout>
        )
      },{
        path: '/playlist/:playlistId',
        element: <PlaylistVideo />
      }, {
        path: '/signup',
        element: <Signup />,
      }, {
        path: '/login',
        element: <Login />,
      },
    ]
  },
  {
    path: '*',
    element: <ChannelWrapper /> //handled /@:username route here
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position='top-right' />
    </Provider>
  </StrictMode>,
)
