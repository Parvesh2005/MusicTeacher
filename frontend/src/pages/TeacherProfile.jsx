// client/src/pages/TeacherProfile.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';

// --- Predefined options for dropdowns & grid ---
const ALL_SKILLS = ['Guitar', 'Piano', 'Ukulele', 'Drums', 'Violin', 'Singing', 'Music Theory'];
const TIME_SLOTS = [
    "00:00", "01:00", "02:00", "03:00", "04:00", "05:00",
    "06:00", "07:00","08:00", "09:00", "10:00", "11:00", 
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"
];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TeacherProfile = () => {
    const { user, setUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [skills, setSkills] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [message, setMessage] = useState('');
    
    const [selectedSkill, setSelectedSkill] = useState(ALL_SKILLS[0]);
    const [newPrice, setNewPrice] = useState('');
    
    const [activeDay, setActiveDay] = useState(DAYS[0]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setSkills(user.skills || []);

            // **FIX APPLIED HERE**
            // This new logic ensures a full 7-day schedule is always created.
            // It merges the user's saved data with a complete weekly template.
            const fullWeekSchedule = DAYS.map(dayName => {
                const savedDay = user.availability?.find(d => d.day === dayName);
                const slots = savedDay 
                    ? savedDay.slots.map(slot => slot.split('-')[0]) 
                    : [];
                return { day: dayName, slots: slots };
            });

            setAvailability(fullWeekSchedule);
        }
    }, [user]);

    // --- Skill Management ---
    const handleAddSkill = () => {
        if (selectedSkill && newPrice > 0 && !skills.find(s => s.skill === selectedSkill)) {
            setSkills([...skills, { skill: selectedSkill, price: parseFloat(newPrice) }]);
            setNewPrice('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setSkills(skills.filter(s => s.skill !== skillToRemove));
    };

    const handlePriceChange = (skillToUpdate, price) => {
        setSkills(skills.map(s => s.skill === skillToUpdate ? { ...s, price: parseFloat(price) || 0 } : s));
    };

    // --- Availability Grid Handler ---
    const toggleTimeSlot = (day, time) => {
        setAvailability(prevAvailability => {
            const newAvailability = JSON.parse(JSON.stringify(prevAvailability));
            const daySchedule = newAvailability.find(d => d.day === day);
            
            if (daySchedule) {
                const slotIndex = daySchedule.slots.indexOf(time);
                if (slotIndex > -1) {
                    daySchedule.slots.splice(slotIndex, 1);
                } else {
                    daySchedule.slots.push(time);
                    daySchedule.slots.sort(); 
                }
            }
            return newAvailability;
        });
    };

    // --- Form Submission ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            // Convert the UI's "08:00" format back to "08:00-09:00" for the database.
            const activeAvailability = availability
                .filter(day => day.slots.length > 0)
                .map(day => ({
                    ...day,
                    slots: day.slots.map(slot => `${slot}-${String(parseInt(slot.split(':')[0]) + 1).padStart(2, '0')}:00`)
                }));

            const { data } = await axios.put('http://localhost:5001/api/profile/me', { name, email, skills, availability: activeAvailability });
            setUser(data);
            setMessage('Profile updated successfully!');
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    if (!user) return <div>Loading...</div>;

    const availableSkills = ALL_SKILLS.filter(skill => !skills.some(s => s.skill === skill));

    return (
        <div className="bg-soft-off-white min-h-screen">
            <Navbar />
            <div className="container mx-auto p-6">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-vibrant-purple mb-6">Your Teacher Profile</h2>
                    {message && <p className="bg-fresh-green/20 text-fresh-green p-3 rounded-md mb-4">{message}</p>}
                    
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">Name</label>
                            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-vibrant-purple" />
                        </div>
                    </div>

                    {/* Skills & Pricing Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Skills & Pricing (per lesson)</h3>
                        <div className="space-y-3 mb-4">
                            {skills.map(({ skill, price }) => (
                                <div key={skill} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-700 flex-grow">{skill}</span>
                                    <input type="number" value={price} onChange={(e) => handlePriceChange(skill, e.target.value)} className="w-24 px-2 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-vibrant-purple" placeholder="Price" />
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-red-500 hover:text-red-700 font-bold">Remove</button>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 p-3 border-t pt-4">
                            <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vibrant-purple bg-white">
                                {availableSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
                            </select>
                            <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-24 px-2 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-vibrant-purple" placeholder="Price" />
                            <button type="button" onClick={handleAddSkill} className="bg-teal-blue text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90">Add Skill</button>
                        </div>
                    </div>

                    {/* Accordion-Style Availability Section */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Weekly Availability</h3>
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Day Selection Column */}
                            <div className="flex flex-row md:flex-col gap-2">
                                {DAYS.map(day => (
                                    <button
                                        type="button"
                                        key={day}
                                        onClick={() => setActiveDay(day)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                                            activeDay === day 
                                                ? 'bg-vibrant-purple text-white shadow' 
                                                : 'bg-gray-100 hover:bg-gray-200'
                                        }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                            {/* Time Slot Grid for the Active Day */}
                            <div className="flex-grow p-4 bg-gray-50 rounded-lg">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-center">
                                    {TIME_SLOTS.map(time => {
                                        const daySchedule = availability.find(d => d.day === activeDay);
                                        const isActive = daySchedule && daySchedule.slots.includes(time);
                                        const endTime = String(parseInt(time.split(':')[0]) + 1).padStart(2, '0') + ':00';

                                        return (
                                            <button
                                                type="button"
                                                key={`${activeDay}-${time}`}
                                                onClick={() => toggleTimeSlot(activeDay, time)}
                                                className={`p-2 rounded-lg transition-colors duration-200 text-sm ${
                                                    isActive 
                                                        ? 'bg-teal-blue text-white' 
                                                        : 'bg-white hover:bg-teal-blue/10 border'
                                                }`}
                                            >
                                                {`${time} - ${endTime}`}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
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