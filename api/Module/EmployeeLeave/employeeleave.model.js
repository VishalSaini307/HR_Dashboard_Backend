import mongoose, { Schema } from 'mongoose';
const EmployeeLeaveSchema = new Schema({
    employeeName: { type: String, required: true },
    designation: { type: String, required: true },
    leaveDate: { type: Date, required: true },
    documents: { type: String },
    reason: { type: String, required: true },
    attendanceStatus: {
        type: String,
        enum: ['Approved', 'Pending', 'Rejected'],
        default: 'Pending',
        required: true
    }
}, { timestamps: true });
export default mongoose.model('EmployeeLeave', EmployeeLeaveSchema);
