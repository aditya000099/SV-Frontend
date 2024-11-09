import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import NavBar from './components/NavBar/NavBar';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
// import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import ChatRoom from './components/ChatRoom/ChatRoom';
import VideoCall from './components/Video/Video';
import Account from './components/Account/Account';
import AiBot from './components/AiBot/AiBot';
import { VideoCallProvider } from './context/Context';
// import { Toaster } from '@radix-ui/react-toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import IncomingCall from "./components/IncomingCall/IncomingCall";
import VideoCallPage from './components/VideoCall/VideoCall';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VideoCallProvider>
          <div className="min-h-screen bg-black text-white">
            <NavBar />
            <IncomingCall />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              {/* <Route path="/reset-password" element={<ResetPassword />} /> */}
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/video" 
                element={
                  <ProtectedRoute>
                    <VideoCallPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chatroom/:id" 
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/video-call" 
                element={
                  <ProtectedRoute>
                    <VideoCall />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/account" 
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ai-bot" 
                element={
                  <ProtectedRoute>
                    <AiBot />
                  </ProtectedRoute>
                } 
              />
            </Routes>
            {/* <Toaster /> */}
          </div>
        </VideoCallProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
