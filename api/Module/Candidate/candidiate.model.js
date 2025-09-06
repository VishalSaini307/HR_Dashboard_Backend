import mongoose, { Schema } from 'mongoose';
const CandidateSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String, required: true },
    dateJoining: { type: Date, required: false },
    attendanceStatus: { type: String, enum: ['Present', 'Absent', 'Medical Leave', 'Work From Home'], default: 'Present' },
    resume: { type: String, required: true },
    status: {
        type: String,
        enum: ['New', 'Schduled', 'Ongoing', 'Selected', 'Rejected'],
        default: 'New',
        required: false
    },
}, { timestamps: true });
export default mongoose.model('Candidate', CandidateSchema);
