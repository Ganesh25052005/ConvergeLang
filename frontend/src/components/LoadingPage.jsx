import React from 'react'
import { useThemeStore } from '../store/useThemeStore'

const LoadingPage = () => {
  const {theme} = useThemeStore();

  return (
    <div>
        <div data-theme={theme} className="h-screen w-screen flex items-center justify-center">
        <span className="loading loading-infinity loading-lg"></span>
        </div>
    </div>
  )
}

export default LoadingPage