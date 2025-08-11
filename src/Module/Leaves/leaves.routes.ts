import { Router } from 'express';
import {
  createLeave,
  getLeaves,
  getLeaveById,
  updateLeave,
  deleteLeave,
  downloadLeaveDocument
} from './leaves.controller';
import { uploadResume, cloudinaryUpload } from '../../Middleware/resumeMiddleware';

const router = Router();

router.post('/create', uploadResume, cloudinaryUpload, createLeave);
router.get('/getall', getLeaves);
router.get('/getbyid/:id', getLeaveById);
router.put('/update/:id', updateLeave);
router.delete('/delete/:id', deleteLeave);
router.get('/:id/download-document', downloadLeaveDocument);

export default router;
