const User = require('../models/User');

const getUserProfile = async (req, res) => {
    if (req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            skills: req.user.skills,
            availability: req.user.availability,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if (req.body.password) {
            user.password = req.body.password;
        }

        if (user.role === 'teacher') {
            user.skills = req.body.skills || user.skills;
            user.availability = req.body.availability || user.availability;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            skills: updatedUser.skills,
            availability: updatedUser.availability,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUserProfile, updateUserProfile };