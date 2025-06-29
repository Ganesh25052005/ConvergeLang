import { LoaderIcon } from 'lucide-react'
import React from 'react'

const ChatLoading = () => {
  return (
    <div className="h-[calc(100vh-64px)] bg-base-100 flex flex-col items-center justify-center p-4">
      <div className='flex justify-center py-12'>
        <span className='loading loading-spinner loading-lg' />
      </div>
    </div>
  )
}

export default ChatLoading