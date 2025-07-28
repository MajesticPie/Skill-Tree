import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const ProfilePage = () => {
  const { shortUrl } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const q = query(
          collection(db, 'profiles'),
          where('shortUrl', '==', shortUrl)
        );
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          setError('Profile not found');
          return;
        }

        const doc = querySnapshot.docs[0];
        setProfile({ id: doc.id, ...doc.data() });
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [shortUrl]);

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-4">
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-full bg-gray-200 h-32 w-32"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto text-center px-4 pt-20 pb-10">
      <p className="text-red-500">{error}</p>
      <button 
        className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate('/')}
      >
        Go Home
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {profile.imageUrl && (
            <img 
              src={profile.imageUrl} 
              alt={profile.name} 
              className="w-32 h-32 rounded-full object-cover border-2 border-indigo-100"
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{profile.name}</h1>
            <p className="text-gray-600 mt-2">{profile.bio}</p>
            <div className="mt-4 text-sm text-gray-500">
              Member since {profile.createdAt?.toDate().toLocaleDateString()}
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Profile URL: skilltree.top/{profile.shortUrl}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;