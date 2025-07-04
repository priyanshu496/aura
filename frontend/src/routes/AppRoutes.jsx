import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Signup from "../screens/Signup.jsx";
import Signin from "../screens/Signin.jsx";
import Home from "../screens/Home.jsx";
import Room from "../screens/Room.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
