import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { storage, db } from '../../firebase/firebase'; // Assuming db (firestore) and storage are exported from firebase.js
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const CreateProfile = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [name, setName] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!name || !shortUrl || !bio) {
            setError('Please fill out all fields.');
            setLoading(false);
            return;
        }

        if (!currentUser) {
            setError('You must be logged in to create a profile.');
            setLoading(false);
            return;
        }

        try {
            let imageUrl = '';
            if (image) {
                // Add a timestamp to the image name to ensure it's unique
                const imageRef = ref(storage, `profiles/${currentUser.uid}/${Date.now()}_${image.name}`);
                await uploadBytes(imageRef, image);
                imageUrl = await getDownloadURL(imageRef);
            }

            const profileData = {
                userId: currentUser.uid,
                name,
                shortUrl,
                bio,
                imageUrl,
                createdAt: new Date()
            };

            // Save to Firestore
            await addDoc(collection(db, "profiles"), profileData);

            setLoading(false);
            alert('Profile created successfully!');
            navigate('/home'); // or to the new profile page
        } catch (err) {
            setError('Failed to create profile. ' + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">Create Your Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-sm text-center text-red-500">{error}</p>}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="shortUrl" className="block text-sm font-medium text-gray-700">
                            Short URL
                        </label>
                        <div className="flex mt-1">
                            <span className="inline-flex items-center px-3 text-gray-500 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                your-site.com/
                            </span>
                            <input
                                id="shortUrl"
                                type="text"
                                value={shortUrl}
                                onChange={(e) => setShortUrl(e.target.value)}
                                required
                                className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-r-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="your-unique-url"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio / Description
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            required
                            rows="4"
                            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                            Profile Image
                        </label>
                        <input
                            id="image"
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full px-3 py-2 mt-1 text-sm text-gray-700 border border-gray-300 rounded-md file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                        >
                            {loading ? 'Creating...' : 'Create Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProfile;