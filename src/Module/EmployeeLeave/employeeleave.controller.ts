

import axios from 'axios';
import { Request, Response } from 'express';
import EmployeeLeave from '../EmployeeLeave/employeeleave.model.js';
import { getCache, setCache, deleteCache } from '../../Cache/cacheHelper.js';

export const createEmployeeLeave = async (req: Request, res: Response) => {
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

		// Invalidate list cache
		await deleteCache('employeeLeaves:all');

		res.status(201).json(leave);
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getEmployeeLeaves = async (_req: Request, res: Response) => {
	const cacheKey = 'employeeLeaves:all';
	try {
		const cached = await getCache(cacheKey);
		if (cached) {
			console.log('✅ [DATA SOURCE] Request served from Redis Cache');
			return res.json({ success: true, data: cached, fromCache: true });
		}
		console.log('🗄️ [DATA SOURCE] Fetching from MongoDB Database');
		const leaves = await EmployeeLeave.find();
		await setCache(cacheKey, leaves);
		res.json({ success: true, data: leaves });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const getEmployeeLeaveById = async (req: Request, res: Response) => {
	try {
		const cacheKey = `employeeLeave:${req.params.id}`;
		const cached = await getCache(cacheKey);
		if (cached) {
			console.log('✅ [DATA SOURCE] Request served from Redis Cache');
			return res.json({ success: true, data: cached, fromCache: true });
		}

		console.log('🗄️ [DATA SOURCE] Fetching from MongoDB Database');
		const leave = await EmployeeLeave.findById(req.params.id);
		if (!leave) return res.status(404).json({ error: 'Leave not found' });

		await setCache(cacheKey, leave);
		res.json({ success: true, data: leave });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

export const updateEmployeeLeave = async (req: Request, res: Response) => {
	try {
		const leave = await EmployeeLeave.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true }
		);
		if (!leave) {
			return res.status(404).json({ error: 'Leave not found' });
		}

		// Invalidate caches
		await deleteCache('employeeLeaves:all');
		await deleteCache(`employeeLeave:${req.params.id}`);

		res.json(leave);
	} catch (error: any) {
		res.status(400).json({ error: error.message });
	}
};

export const deleteEmployeeLeave = async (req: Request, res: Response) => {
	try {
		const leave = await EmployeeLeave.findByIdAndDelete(req.params.id);
		if (!leave) return res.status(404).json({ error: 'Leave not found' });

		// Invalidate caches
		await deleteCache('employeeLeaves:all');
		await deleteCache(`employeeLeave:${req.params.id}`);

		res.json({ message: 'Leave deleted' });
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};
export const downloadEmployeeLeaveDocument = async (req: Request, res: Response) => {
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
		https.get(fileUrl, { method: 'HEAD' }, (response: any) => {
			if (response.statusCode === 404) {
				return res.status(404).json({ error: 'Document file not found on Cloudinary.' });
			}
			
			res.redirect(fileUrl);
		}).on('error', (err: any) => {
			res.status(500).json({ error: 'Error checking file on Cloudinary.' });
		});
	} catch (error: any) {
		res.status(500).json({ error: error.message });
	}
};

