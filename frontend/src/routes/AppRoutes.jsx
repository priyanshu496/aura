import React from 'react'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Signin from '../screens/Signin'
import Signup from '../screens/Signup'
import Home from '../screens/Home'
import Room from '../screens/Room'
import UserAuth from '../auth/UserAuth'

const AppRoutes = () => {
    return (
        <BrowserRouter>

            <Routes>
                <Route path="/" element={<UserAuth><Home /></UserAuth>} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/room" element={<UserAuth><Room /></UserAuth>} />
            </Routes>

        </BrowserRouter>
    )
}

export default AppRoutes