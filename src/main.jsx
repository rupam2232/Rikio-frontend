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
import PrivateVideo from './pages/PrivateVideo.page.jsx'
import UploadVideo from './pages/UploadVideo.page.jsx'
import Dashboard from './pages/Dashboard.page.jsx'
import Playlist from './pages/Playlist.page.jsx'
import PlaylistVideo from './pages/PlaylistVideo.page.jsx'
import Subscribed from './pages/Subscribed.page.jsx'
import LikedVideo from './pages/LikedVideo.page.jsx'
import WatchHistory from './pages/WatchHistory.page.jsx'
import Settings from './pages/Settings.page.jsx'
import Tweet from './pages/Tweet.page.jsx'
import NotFound from './pages/NotFound.page.jsx'
import SearchResult from './pages/SearchResult.page.jsx'
import TermsAndConditions from './pages/TermsAndConditions.page.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.page.jsx'

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
        element: (
          <AuthLayout >
            <LikedVideo />
          </AuthLayout>
        )
      }, {
        path: '/watch-history',
        element: (
          <AuthLayout >
            <WatchHistory />
          </AuthLayout>
        )
      }, {
        path: '/playlists',
        element: (
          <AuthLayout >
            <Playlist />
          </AuthLayout>
        )
      }, {
        path: '/playlists/create',
        element: (
          <AuthLayout >
            <Playlist />
          </AuthLayout>
        )
      }, {
        path: '/subscribed',
        element: (
          <AuthLayout >
            <Subscribed />
          </AuthLayout>
        )
      }, {
        path: '/settings',
        element: (
          <AuthLayout >
            <Settings />
          </AuthLayout>
        )
      }, {
        path: '/settings/:tab',
        element: (
          <AuthLayout >
            <Settings />
          </AuthLayout>
        )
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
        path: '/prv/video/:videoId',
        element: (
          <AuthLayout >
            <PrivateVideo />
          </AuthLayout>
        )
      }, {
        path: '/upload',
        element: (
          <AuthLayout >
            <UploadVideo />
          </AuthLayout>
        )
      }, {
        path: '/playlist/:playlistId',
        element: <PlaylistVideo />
      }, {
        path: '/tweet/:tweetId',
        element: <Tweet />
      }, {
        path: '/signup',
        element: <Signup />,
      }, {
        path: '/login',
        element: <Login />,
      }, {
        path: '/search',
        element: <SearchResult />
      }, {
        path: '/terms',
        element: <TermsAndConditions />
      } ,{
        path: '/privacy',
        element: <PrivacyPolicy />
      }
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
