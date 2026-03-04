import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import CreateRoom from "./pages/CreateRoom";

const App = () => {
  return (
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
    </Routes>
  );
};

export default App;
