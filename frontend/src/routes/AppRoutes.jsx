import React from "react";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Signup from "../screens/Signup.jsx";
import Signin from "../screens/Signin.jsx";
import Home from "../screens/Home.jsx";
import Room from "../screens/Room.jsx";
import UserAuth from "../auth/UserAuth.jsx";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <UserAuth><Home /></UserAuth>  } />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/room" element={ <UserAuth> <Room /></UserAuth> } />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
