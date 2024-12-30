import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import {Header} from "./components/index.js"
import {Aside} from './components/index.js'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
    <main className='mx-auto max-w-[85rem]'>
    <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
      <Aside />
      <Outlet />
      </div>
    </main>
    </>
  )
}

export default App
