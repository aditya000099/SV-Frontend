import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export function Account() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        bio: response.data.bio || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto bg-gray-900 backdrop-blur-lg bg-opacity-50 
                     hover:bg-opacity-70 transition-all duration-300 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">Account Settings</h1>
        
        {profile && !isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400">Name</label>
              <p className="text-white text-lg">{profile.name}</p>
            </div>
            <div>
              <label className="text-gray-400">Email</label>
              <p className="text-white text-lg">{profile.email}</p>
            </div>
            <div>
              <label className="text-gray-400">Bio</label>
              <p className="text-white text-lg">{profile.bio || 'No bio added'}</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 block mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 bg-gray-800 text-white rounded"
              />
            </div>
            <div>
              <label className="text-gray-400 block mb-1">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full p-2 bg-gray-800 text-white rounded"
                rows="4"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpdateProfile}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account; 