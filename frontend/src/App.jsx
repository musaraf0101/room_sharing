import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import CreateRoom from "./pages/CreateRoom";
import ViewRoom from "./pages/ViewRoom";
import UpdateProfile from "./pages/UpdateProfile";
import MyRooms from "./pages/MyRooms";
import UpdateRoom from "./pages/UpdateRoom";
import PostRequest from "./pages/PostRequest";
import MyRequests from "./pages/MyRequests";
import ViewRequest from "./pages/ViewRequest";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/home" element={<Home />} />
        <Route
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />
        <Route path="/view-room/:id" element={<ViewRoom />} />
        <Route
          path="/my-rooms"
          element={
            <ProtectedRoute>
              <MyRooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-room/:id"
          element={
            <ProtectedRoute>
              <UpdateRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-request"
          element={
            <ProtectedRoute>
              <PostRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-requests"
          element={
            <ProtectedRoute>
              <MyRequests />
            </ProtectedRoute>
          }
        />
        <Route path="/view-request/:id" element={<ViewRequest />} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      </Routes>
    </>
  );
};

export default App;
