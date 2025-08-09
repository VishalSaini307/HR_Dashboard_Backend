
import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeLeave extends Document {
	employeeName: string;
	designation: string;
	leaveDate: Date;
	documents?: string;
	reason: string;
	attendanceStatus: 'Approved' | 'Pending' | 'Rejected';
}

const EmployeeLeaveSchema: Schema = new Schema({
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

export default mongoose.model<IEmployeeLeave>('EmployeeLeave', EmployeeLeaveSchema);
