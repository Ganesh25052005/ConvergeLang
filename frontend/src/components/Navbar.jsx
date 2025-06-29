import React from 'react'
import { BellIcon, LogOutIcon, Waypoints } from 'lucide-react'
import useLoginHook from '../hooks/useLoginHook'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api'
import ThemeSelector from './ThemeSelector'
import { Link } from 'react-router'


const Navbar = () => {

  const queryClient = useQueryClient();
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['authUser'] }) }
  });

  return (
    <nav className="bg-base-200 border-b border-base-content/40 rounded-b-sm sticky top-0 z-10 h-16">
      <div className="flex flex-row justify-between h-full p-4">
        <div >
          <Link className='flex items-center gap-2.5 cursor-pointer' to='/'>
            <Waypoints className="size-9 text-primary" />
            <span className="hidden sm:block text-3xl font-bold font-Titillium+Web bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wide">
              ConvergeLang
            </span>
          </Link>
        </div>
        <div className='flex gap-2 items-center'>
          <ThemeSelector />
          <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
            <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
          </button>
        </div>
      </div>
    </nav>

  )
}

export default Navbar