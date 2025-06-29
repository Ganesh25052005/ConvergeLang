import React from 'react'
import useAuthHook from '../hooks/useAuthHook'
import { Link, useLocation } from 'react-router';
import { BellIcon, HomeIcon, MessageCircle, UserIcon } from 'lucide-react';

const Sidebar = () => {

  const { authUser } = useAuthHook();
  const location = useLocation();
  const currentPath = location.pathname;
  const isChatRoute = currentPath.startsWith("/chat");

  return (
    <aside className='w-16 sm:w-44 md:w-56 bg-base-200 border-r border-base-content/40 h-[calc(100vh-64px)] overflow-y-clip flex flex-col sticky top-[64px]'>
      
      <nav className='flex-1 p-2 sm:p-4 space-y-2'>
        <Link
          to='/'
          className={`btn flex justify-center btn-ghost sm:justify-start w-full gap-3 px-3 normal-case ${currentPath === "/"? "btn-active":""}`}
        >
          <HomeIcon className='size-8 sm:size-5 text-base-content opacity-70'/>
          <span className='hidden sm:block'>Home</span>
        </Link>

        <Link
          to='/chat/inbox'
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case 
            ${ isChatRoute ? "btn-active":""}`}
        >
          <MessageCircle className='size-8 sm:size-5 text-base-content opacity-70'/>
          <span className='hidden sm:block'>Chat</span>
        </Link> 

        <Link
          to='/friends'
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case 
            ${currentPath === "/friends"? "btn-active":""}`}
        >
          <UserIcon className='size-8 sm:size-5 text-base-content opacity-70'/>
          <span className='hidden sm:block'>Friends</span>
        </Link>
        <Link
          to='/notifications'
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case 
            ${currentPath === "/notifications"? "btn-active":""}`}
        >
          <BellIcon className='size-8 sm:size-5 text-base-content opacity-70'/>
          <span className='hidden sm:block'>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-2 sm:p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="size-12 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          <div className="hidden sm:flex justify-center ">
            <p className="font-semibold text-sm overflow-hidden">{authUser?.fullname}</p>
          </div>
        </div>
      </div>

    </aside>
  )
}

export default Sidebar