import express from 'express';
import { uploadFile, cloudinaryUpload } from '../../Middleware/resume.middleware';
import {
	createEmployeeLeave,
	getEmployeeLeaves,
	getEmployeeLeaveById,
	updateEmployeeLeave,
	deleteEmployeeLeave
} from './employeeleave.controller';
import { downloadEmployeeLeaveDocument } from './employeeleave.controller';

const router = express.Router();

// Create new leave with file upload and cloudinary middleware
router.post('/', uploadFile, cloudinaryUpload, createEmployeeLeave);
// Get all leaves
router.get('/', getEmployeeLeaves);

// Get leave by ID
router.get('/:id', getEmployeeLeaveById);

// Update leave by ID
router.put('/:id', updateEmployeeLeave);

// Download leave document

router.get('/:id/download-document', downloadEmployeeLeaveDocument);

// Delete leave by ID
router.delete('/:id', deleteEmployeeLeave);

export default router;
