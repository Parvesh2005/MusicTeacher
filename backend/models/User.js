const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TimeSlotSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
    },
    slots: [{ type: String, required: true }] // e.g., ["09:00-10:00", "10:00-11:00"]
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    // Teacher-specific fields
    skills: { 
        type: [String], 
        default: undefined 
    },
    availability: {
        type: [TimeSlotSchema],
        default: undefined
    }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Only include teacher fields if role is 'teacher'
UserSchema.pre('validate', function(next) {
    if (this.role !== 'teacher') {
        this.skills = undefined;
        this.availability = undefined;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);