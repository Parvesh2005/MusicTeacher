import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ theme = 'light' }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isTransparent = theme === 'transparent';
    
    const navClasses = isTransparent 
        ? 'w-full absolute top-0 left-0 z-20' 
        : 'bg-white shadow-md sticky top-0 z-50';
    const textColor = isTransparent ? 'text-white' : 'text-teal-blue';
    const hoverTextColor = isTransparent ? 'hover:text-gray-200' : 'hover:text-vibrant-purple';
    const signUpButtonClasses = isTransparent
        ? 'bg-transparent border border-white text-white rounded-md px-4 py-2 hover:bg-white hover:text-vibrant-purple font-medium transition-all'
        : 'bg-teal-blue text-white rounded-md px-4 py-2 hover:bg-vibrant-purple font-medium';

    return (
        <nav className={navClasses}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className={`text-2xl font-bold ${textColor} transition-colors`}>MusicTeacher.live</Link>
                <div>
                    {user ? (
                        <>
                            <Link to="/profile" className={`${textColor} ${hoverTextColor} mx-4 font-medium transition-colors`}>My Profile</Link>
                            <button onClick={handleLogout} className="bg-coral-orange text-white rounded-md px-4 py-2 hover:bg-opacity-90 font-medium">
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`${textColor} ${hoverTextColor} mx-4 font-medium transition-colors`}>Log In</Link>
                            <Link to="/register-student" className={signUpButtonClasses}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};