import mongoose, { Schema } from "mongoose";
const LeaveSchema = new Schema({
    employee: { type: Schema.Types.ObjectId, ref: "Candidate", required: true, },
    designation: { type: String, required: true, },
    leaveDate: { type: Date, required: true, },
    documents: { type: String, required: false, },
    reason: { type: String, required: true, },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending",
    },
}, { timestamps: true });
export default mongoose.model("Leave", LeaveSchema);
