import "./index.css";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuthStore } from "./stores/useAuthStore.js";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useChatStore } from "./stores/useChatStore.js";
import CallPage from "./pages/CallPage.jsx";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { caller, inCall, voiceChat } = useChatStore();
  const localtion = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {}, [inCall]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-15 animate-spin" />
      </div>
    );
  }
  // return <CallPage />;
  return (
    <div>
      {localtion.pathname === "/call" || <Navbar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={
            inCall ? (
              <CallPage
                fullName={caller?.fullName}
                profilePic={caller?.profilePic}
                voice={voiceChat}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
