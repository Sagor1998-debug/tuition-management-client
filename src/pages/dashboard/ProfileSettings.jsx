import DashboardLayout from '../../layouts/DashboardLayout';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function ProfileSettings() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '');

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      await api.patch(
        '/users/profile',
        { name, photoUrl },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update profile');
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-emerald-800">
          Profile Settings
        </h2>

        <div className="flex flex-col items-center mb-8">
          <div className="avatar">
            <div className="w-32 rounded-full ring ring-emerald-600 ring-offset-base-100 ring-offset-4">
              <img
                src={photoUrl || '/src/assets/default-avatar.jpg'}
                alt="Profile"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="label font-medium">Photo URL</label>
            <input
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Paste image URL here"
            />
          </div>

          <button
            onClick={handleUpdate}
            className="btn btn-success w-full"
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
