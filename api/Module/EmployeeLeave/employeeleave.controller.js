import EmployeeLeave from './employeeleave.model.js';
export const createEmployeeLeave = async (req, res) => {
    try {
        const requiredFields = ['employeeName', 'designation', 'leaveDate', 'reason'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
        const leave = await EmployeeLeave.create({
            employeeName: req.body.employeeName,
            designation: req.body.designation,
            leaveDate: req.body.leaveDate,
            documents: req.body.documents,
            reason: req.body.reason,
            attendanceStatus: req.body.attendanceStatus || 'Absent'
        });
        res.status(201).json(leave);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getEmployeeLeaves = async (_req, res) => {
    try {
        const leaves = await EmployeeLeave.find();
        res.json(leaves);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const getEmployeeLeaveById = async (req, res) => {
    try {
        const leave = await EmployeeLeave.findById(req.params.id);
        if (!leave)
            return res.status(404).json({ error: 'Leave not found' });
        res.json(leave);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const updateEmployeeLeave = async (req, res) => {
    try {
        const leave = await EmployeeLeave.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!leave) {
            return res.status(404).json({ error: 'Leave not found' });
        }
        res.json(leave);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
export const deleteEmployeeLeave = async (req, res) => {
    try {
        const leave = await EmployeeLeave.findByIdAndDelete(req.params.id);
        if (!leave)
            return res.status(404).json({ error: 'Leave not found' });
        res.json({ message: 'Leave deleted' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
export const downloadEmployeeLeaveDocument = async (req, res) => {
    try {
        const leave = await EmployeeLeave.findById(req.params.id);
        if (!leave || !leave.documents) {
            return res.status(404).json({ error: "Document not found" });
        }
        let fileUrl = leave.documents;
        if (fileUrl.includes("/image/upload/")) {
            fileUrl = fileUrl.replace("/image/upload/", "/raw/upload/");
        }
        fileUrl = fileUrl.replace('/upload/', '/upload/fl_attachment/');
        const https = require('https');
        https.get(fileUrl, { method: 'HEAD' }, (response) => {
            if (response.statusCode === 404) {
                return res.status(404).json({ error: 'Document file not found on Cloudinary.' });
            }
            res.redirect(fileUrl);
        }).on('error', (err) => {
            res.status(500).json({ error: 'Error checking file on Cloudinary.' });
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
