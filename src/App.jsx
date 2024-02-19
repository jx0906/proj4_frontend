//for overall app structure, ie routes and navigation
import React from "react";
import { Routes, Route } from "react-router-dom";
import "./app.css";
import { Layout } from "./components/layout/Layout.jsx";
import UserLogin from "./pages/user/Login.jsx";
import UserSignUp from "./pages/user/Signup.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} />
        {/* Root */}
        {/* <Route index element={<RestaurantList />} /> */}

        {/* User */}
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignUp />} />
      </Routes>
    </>
  );
}

export default App;
