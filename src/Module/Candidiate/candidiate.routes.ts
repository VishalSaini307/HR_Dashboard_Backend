
import { Router } from 'express';
import {
  createCandidate,
  getCandidates,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
  downloadCandidateResume
} from './candidiate.controller';
import { uploadFile, cloudinaryUpload } from '../../Middleware/resume.middleware';


const router = Router();

router.post('/create', uploadFile, cloudinaryUpload, createCandidate);
router.get('/getall', getCandidates);
router.get('/getbyid/:id', getCandidateById);
router.put('/update/:id', updateCandidate);
router.delete('/delete/:id', deleteCandidate);
router.get('/:id/download-resume', downloadCandidateResume);



export default router;
