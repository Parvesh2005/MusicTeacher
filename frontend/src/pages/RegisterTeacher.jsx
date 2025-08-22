import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterTeacher = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password, role: 'teacher' });
            login(data, data.token);
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-vibrant-purple via-vibrant-purple/10 to-soft-off-white flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-vibrant-purple mb-2">Become a Teacher</h2>
                    <p className="text-gray-600">Apply to join our team of talented instructors.</p>
                </div>
                
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md text-center">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
                        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple transition" required placeholder="Jane Smith" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple transition" required placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple transition" required placeholder="••••••••" />
                    </div>
                    <button type="submit" className="w-full bg-vibrant-purple text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-blue transition-transform transform hover:scale-105 duration-300">
                        Create Teacher Account
                    </button>
                </form>
                 <p className="text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-vibrant-purple hover:underline font-bold">Log in</Link>.
                </p>
            </div>
        </div>
    );
};

export default RegisterTeacher;