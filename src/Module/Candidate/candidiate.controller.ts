import Candidate from './candidiate.model.js';
import { Request, Response } from 'express';
import axios from 'axios';
import { setCache , deleteCache ,getCache} from '../../Cache/cacheHelper.js';

export const createCandidate = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Incoming candidate data:', req.body);
      console.log('Incoming file:', req.file);
    }

    if (req.file && req.body.documents) {
      req.body.resume = req.body.documents;
    }


    const requiredFields = ['fullName', 'email', 'phoneNumber', 'position', 'experience', 'resume'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

   
    const candidate = await Candidate.create({
      fullName: req.body.fullName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      position: req.body.position,
      experience: req.body.experience,
      resume: req.body.resume
    });
    await deleteCache('candidates:all'); // or setCache('candidates:all', null)
    res.status(201).json(candidate);
  } catch (error: any) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCandidates = async (_req: Request, res: Response) => {
  const cacheKey = "candidates:all";
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached, fromCache: true });
    }
    const candidates = await Candidate.find();
    await setCache(cacheKey, candidates);
    res.json({ success: true, data: candidates });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCandidateById = async (req: Request, res: Response) => {
  try {
    const cacheKey = `candidate:${req.params.id}`;
    const cached = await getCache(cacheKey);
    if (cached) return res.json({ success: true, data: cached, fromCache: true });

    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    await setCache(cacheKey, candidate);
    res.json({ success: true, data: candidate });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCandidate = async (req: Request, res: Response) => {
  try {
    if (req.body.status === 'Selected') {
      req.body.dateJoining = new Date();
    }
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // Invalidate caches
    await deleteCache('candidates:all');
    await deleteCache(`candidate:${req.params.id}`);

    res.json(candidate);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteCandidate = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    // Invalidate caches
    await deleteCache('candidates:all');
    await deleteCache(`candidate:${req.params.id}`);

    res.json({ message: 'Candidate deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const downloadCandidateResume = async (req: Request, res: Response) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate || !candidate.resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    let url = candidate.resume;
    if (url.includes('/image/upload/')) {
      url = url.replace('/image/upload/', '/raw/upload/');
    }
    url = url.replace('/upload/', '/upload/fl_attachment/');

    const https = require('https');
    https.get(url, { method: 'HEAD' }, (response: any) => {
      if (response.statusCode === 404) {
        return res.status(404).json({ error: 'Resume file not found on Cloudinary.' });
      }
    
      res.redirect(url);
    }).on('error', (err: any) => {
      res.status(500).json({ error: 'Error checking file on Cloudinary.' });
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};



