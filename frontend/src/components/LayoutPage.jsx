import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const LayoutPage = ({children}) => {
  return (
        <div className='h-screen flex flex-col'>
          <Navbar/>
          <div className='flex flex-1 flex-row min-h-0'>
          <Sidebar/>
          <main className='flex-1 overflow-y-auto '>
            {children}
          </main>
          </div>
        </div>
  )
}

export default LayoutPage