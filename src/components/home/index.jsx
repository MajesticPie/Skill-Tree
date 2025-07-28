import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchUserProfiles = async () => {
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "profiles"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const userProfiles = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProfiles(userProfiles);
      } catch (err) {
        setError("Failed to load profiles.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfiles();
  }, [currentUser]);

  const handleDeleteProfile = async (profileId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this profile? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const profileRef = doc(db, "profiles", profileId);
      await deleteDoc(profileRef);
      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile.id !== profileId)
      );
    } catch (err) {
      setError("Failed to delete profile. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {currentUser.displayName || currentUser.email}!
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Manage your profiles or create a new one.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">My Profiles</h3>
            {loading && <p className="text-sm text-gray-500 mt-2">Loading profiles...</p>}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
            {!loading && !error && (
              <div className="mt-2 space-y-2">
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <div
                      key={profile.id}
                      className="flex items-center justify-between p-3 bg-gray-100 rounded-md hover:bg-gray-200 transition group"
                    >
                      <Link
                        to={`/${profile.shortUrl}`}
                        className="flex-grow"
                      >
                        <p className="font-semibold text-indigo-600 group-hover:underline">
                          {profile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          skilltree.top/{profile.shortUrl}
                        </p>
                      </Link>
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="ml-4 px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">You haven't created any profiles yet.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/create-profile")}
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create New Profile
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
    </div>
  );
};

export default Home;
