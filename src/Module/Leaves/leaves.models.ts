import mongoose, { Schema, Document } from "mongoose";

export interface ILeave extends Document {
  employee: mongoose.Types.ObjectId; 
  designation: string;
  leaveDate: Date;
  documents?: string; 
  reason: string;
  status: "Pending" | "Approved" | "Rejected";
}

const LeaveSchema: Schema = new Schema(
  {
    employee: {type: Schema.Types.ObjectId,ref: "Candidate",required: true,},
    designation: {type: String,required: true,},
    leaveDate: {type: Date,required: true,},
    documents: {type: String, required : false,},
    reason: {type: String,required: true,},
    status: {type: String,enum: ["Pending", "Approved", "Rejected"],default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILeave>("Leave", LeaveSchema);
