import React from 'react'
import useAuthHook from '../hooks/useAuthHook'
import { Link, useLocation } from 'react-router';
import { BellIcon, HomeIcon, MessageCircle, UserIcon } from 'lucide-react';

const ChatSideBar = () => {

  const { authUser } = useAuthHook();
  const location = useLocation();
  const currentPath = location.pathname;
  const isChatRoute = currentPath.startsWith("/chat");

  return (
    <aside className='w-16 bg-base-200 border-r border-base-content/40 h-[calc(100vh-64px)] overflow-y-clip flex flex-col sticky top-[64px]'>
      
      <nav className='flex-1 p-2 sm:py-4 space-y-2'>
        <Link
          to='/'
          className={`btn flex justify-center btn-ghost sm:justify-start w-full  px-3
            ${currentPath === "/"? "btn-active":""}`}
        >
          <HomeIcon className='size-8 opacity-70'/>
        </Link>

        <Link
          to='/chat/inbox'
          className={`btn btn-ghost justify-start w-full px-3 
            ${isChatRoute? "btn-active":""}`}
        >
          <MessageCircle className='size-8 opacity-70'/>
        </Link> 

        <Link
          to='/friends'
          className={`btn btn-ghost justify-start w-full px-3
            ${currentPath === "/friends"? "btn-active":""}`}
        >
          <UserIcon className='size-8 opacity-70'/>
        </Link>
        <Link
          to='/notifications'
          className={`btn btn-ghost justify-start w-full px-3
            ${currentPath === "/notifications"? "btn-active":""}`}
        >
          <BellIcon className='size-8 opacity-70'/>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-2 sm:py-4 border-t border-base-300 mt-auto">
        <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="size-12 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
        </div>
      </div>

    </aside>
  )
}

export default ChatSideBar