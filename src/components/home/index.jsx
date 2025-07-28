import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {currentUser.displayName || currentUser.email}!
          </h2>
          <p className="mt-2 text-sm text-gray-500">What would you like to do?</p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/create-profile")}
            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create
          </button>

          <button
            onClick={() => { doSignOut().then(() => navigate("/login")); }}
            className="w-full px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
