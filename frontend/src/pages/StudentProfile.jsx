import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

const StudentProfile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const { data } = await axios.put('/api/profile/me', { name, email });
            setUser(data);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="bg-soft-off-white min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-teal-blue mb-6">Your Student Profile</h2>
                    {message && <p className="bg-fresh-green/20 text-fresh-green p-3 rounded-md mb-4">{message}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-blue" />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-blue" />
                        </div>
                        <button type="submit" className="bg-teal-blue text-white font-bold py-2 px-6 rounded-lg hover:bg-vibrant-purple transition duration-300">
                            Save Changes
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;