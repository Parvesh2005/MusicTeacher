import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

const ALL_SKILLS = ['Guitar', 'Piano', 'Ukulele', 'Drums', 'Violin', 'Singing', 'Music Theory'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherProfile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setSkills(user.skills || []);
            setAvailability(user.availability || DAYS.map(day => ({ day, slots: [] })));
        }
    }, [user]);

    const handleSkillChange = (skill) => {
        setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
    };

    const handleSlotChange = (day, slotIndex, value) => {
        const newAvailability = [...availability];
        const dayIndex = newAvailability.findIndex(d => d.day === day);
        newAvailability[dayIndex].slots[slotIndex] = value;
        setAvailability(newAvailability);
    };
    
    const addSlot = (day) => {
        const newAvailability = [...availability];
        const dayIndex = newAvailability.findIndex(d => d.day === day);
        newAvailability[dayIndex].slots.push("09:00-10:00");
        setAvailability(newAvailability);
    };

    const removeSlot = (day, slotIndex) => {
        const newAvailability = [...availability];
        const dayIndex = newAvailability.findIndex(d => d.day === day);
        newAvailability[dayIndex].slots.splice(slotIndex, 1);
        setAvailability(newAvailability);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const { data } = await axios.put('http://localhost:5001/api/profile/me', { name, email, skills, availability });
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
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-vibrant-purple mb-6">Your Teacher Profile</h2>
                    {message && <p className="bg-fresh-green/20 text-fresh-green p-3 rounded-md mb-4">{message}</p>}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple" />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Skills</h3>
                        <div className="flex flex-wrap gap-3">
                            {ALL_SKILLS.map(skill => (
                                <button key={skill} type="button" onClick={() => handleSkillChange(skill)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${skills.includes(skill) ? 'bg-vibrant-purple text-white' : 'bg-gray-200 text-gray-700'}`}>
                                    {skill}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Weekly Availability</h3>
                        <div className="space-y-4">
                            {availability.map(({ day, slots }) => (
                                <div key={day} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                                    <label className="font-bold text-gray-600 md:text-right md:pt-2">{day}</label>
                                    <div className="md:col-span-3 space-y-2">
                                        {slots.map((slot, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <input type="text" value={slot} onChange={(e) => handleSlotChange(day, i, e.target.value)} className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-vibrant-purple" placeholder="e.g., 14:00-15:00"/>
                                                <button type="button" onClick={() => removeSlot(day, i)} className="text-red-500 hover:text-red-700 font-bold">X</button>
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => addSlot(day)} className="text-sm text-teal-blue hover:underline">+ Add time slot</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-vibrant-purple text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-blue transition duration-300">
                        Save All Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherProfile;