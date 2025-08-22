// server/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// New schema for teacher's skills, now including a price
const SkillPriceSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    price: { type: Number, required: true } // Price per lesson for this skill
}, { _id: false });

// New schema to track which student learns what from a teacher
const TeacherStudentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true }
}, { _id: false });

// New schema to track what a student learns from which teacher
const StudentLearningSchema = new mongoose.Schema({
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skill: { type: String, required: true }
}, { _id: false });

const TimeSlotSchema = new mongoose.Schema({
    day: { 
        type: String, 
        required: true,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] 
    },
    slots: [{ type: String, required: true }]
}, { _id: false });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher'], required: true },
    
    // --- Teacher-specific fields ---
    skills: { 
        type: [SkillPriceSchema], 
        default: undefined 
    },
    availability: {
        type: [TimeSlotSchema],
        default: undefined
    },
    students: {
        type: [TeacherStudentSchema],
        default: undefined
    },

    // --- Student-specific fields ---
    learning: {
        type: [StudentLearningSchema],
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

// Conditionally manage fields based on role
UserSchema.pre('validate', function(next) {
    if (this.role === 'student') {
        this.skills = undefined;
        this.availability = undefined;
        this.students = undefined;
    } else if (this.role === 'teacher') {
        this.learning = undefined;
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);