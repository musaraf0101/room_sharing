import React from "react";
import api from "../utils/api";

const Home = () => {
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      alert("logout success");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
