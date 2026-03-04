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
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-room"
          element={
            <ProtectedRoute>
              <CreateRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-room/:id"
          element={
            <ProtectedRoute>
              <ViewRoom />
            </ProtectedRoute>
          }
        />
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
      </Routes>
    </>
  );
};

export default App;
