import express from 'express';
import { uploadFile, cloudinaryUpload } from '../../Middleware/resumeMiddleware.js';
import {
	createEmployeeLeave,
	getEmployeeLeaves,
	getEmployeeLeaveById,
	updateEmployeeLeave,
	deleteEmployeeLeave,
	downloadEmployeeLeaveDocument
} from './employeeleave.controller.js';

const router = express.Router();


router.post('/', uploadFile, cloudinaryUpload, createEmployeeLeave);

router.get('/', getEmployeeLeaves);


router.get('/:id', getEmployeeLeaveById);


router.put('/:id', updateEmployeeLeave);


router.get('/:id/download-document', downloadEmployeeLeaveDocument);

router.delete('/:id', deleteEmployeeLeave);

export default router;
