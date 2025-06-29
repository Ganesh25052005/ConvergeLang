import { Navigate, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import SignUpPage from "./pages/SignUpPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import NotificationPage from "./pages/NotificationsPage";
import LoadingPage from "./components/LoadingPage";

import { Toaster } from "react-hot-toast";


import useAuthHook from "./hooks/useAuthHook.js";
import LayoutPage from "./components/LayoutPage.jsx";
import FriendsPage from "./pages/FriendsPage.jsx";
import { useThemeStore } from "./store/useThemeStore.js";
import ChatLayout from "./components/ChatLayout.jsx";

const App = () => {

  const { theme } = useThemeStore();
  const { isLoading, authUser } = useAuthHook();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.Onboarded;


  if (isLoading) {
    return <LoadingPage />;
  }


  return (
    <div className="h-screen font-sans" data-theme={theme}>
      <Routes>
        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <LayoutPage>
            <HomePage />
          </LayoutPage>
        )
          : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? '/' : '/onboarding'} />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? '/' : '/onboarding'} />} />
        <Route path="/onboarding" element={
          isAuthenticated ?
            (!isOnboarded ? <OnBoardingPage /> : <Navigate to='/' />) :
            (<Navigate to='/login' />)
        }
        />
        <Route path="/chat/:id" element={ isAuthenticated && isOnboarded ? (
        <ChatLayout>
          <ChatPage/>
        </ChatLayout>
        )
        :(
          <Navigate to={!isAuthenticated? "/login":"/onboarding"} />
        ) } />
        <Route path="/call/:id" element={ isAuthenticated && isOnboarded ? (
        <CallPage/>
        )
        :(
          <Navigate to={!isAuthenticated? "/login":"/onboarding"} />
        ) } />
        <Route path="/friends" element={ isAuthenticated && isOnboarded ? (
        <LayoutPage>
          <FriendsPage/>
        </LayoutPage>
        )
        :(
          <Navigate to={!isAuthenticated? "/login":"/onboarding"} />
        ) } />
        <Route path="/notifications" element={isAuthenticated && isOnboarded ? (
          <LayoutPage>
            <NotificationPage />
          </LayoutPage>
        )
          : (
            <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
          )} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
