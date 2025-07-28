import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

import Home from '../components/home';
import Login from '../components/auth/login';
import Register from '../components/auth/register';
import CreateProfile from '../components/createProfile';

// A simple component to protect routes.
// It checks if the user is logged in. If not, it redirects to the /login page.
const PrivateRoute = ({ children }) => {
    const { userLoggedIn } = useAuth();
    return userLoggedIn ? children : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Private routes */}
            <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/create-profile" element={<PrivateRoute><CreateProfile /></PrivateRoute>} />

            {/* Redirect any other path to home */}
            <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
    );
};

export default AppRoutes;