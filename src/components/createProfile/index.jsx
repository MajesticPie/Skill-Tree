import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext';
import { storage, db } from '../../firebase/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'; // Added imports

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

    // Function to check if short URL is available
    const checkShortUrl = async () => {
        const q = query(
            collection(db, "profiles"),
            where("shortUrl", "==", shortUrl)
        );
        const snapshot = await getDocs(q);
        return snapshot.empty; // true if available, false if taken
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Basic validation
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

        // URL validation
        const urlPattern = /^[a-zA-Z0-9_-]+$/;
        if (!urlPattern.test(shortUrl)) {
            setError('Short URL can only contain letters, numbers, hyphens, and underscores.');
            setLoading(false);
            return;
        }

        try {
            // Check if short URL is available
            const isAvailable = await checkShortUrl();
            if (!isAvailable) {
                setError('This URL is already taken. Please choose another one.');
                setLoading(false);
                return;
            }

            let imageUrl = '';
            if (image) {
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

            await addDoc(collection(db, "profiles"), profileData);

            setLoading(false);
            alert('Profile created successfully!');
            navigate(`/${shortUrl}`); // Navigate to the new profile
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
                                skilltree.top/
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
                        <p className="mt-1 text-xs text-gray-500">
                            Only letters, numbers, hyphens, and underscores allowed
                        </p>
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