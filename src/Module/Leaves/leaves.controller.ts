import Leave from './leaves.models.js';
import { Request, Response } from 'express';
import { getCache, setCache, deleteCache } from '../../Cache/cacheHelper.js';

// Create a new leave
export const createLeave = async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Incoming leave data:', req.body);
      console.log('Incoming file:', req.file);
    }

    // Required fields from form
    const requiredFields = ['employee', 'designation', 'leaveDate', 'reason'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Create leave
    const leave = await Leave.create({
      employee: req.body.employee,
      designation: req.body.designation,
      leaveDate: req.body.leaveDate,
      documents: req.body.documents || null,
      reason: req.body.reason,
      status: req.body.status || 'Pending'
    });

    res.status(201).json(leave);
  } catch (error: any) {
    console.error('Error creating leave:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all leaves
export const getLeaves = async (_req: Request, res: Response) => {
  const cacheKey = 'leaves:all';
  try {
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('✅ [DATA SOURCE] Request served from Redis Cache');
      return res.json(cached);
    }
    console.log('🗄️ [DATA SOURCE] Fetching from MongoDB Database');
    const leaves = await Leave.find().populate('employee');
    await setCache(cacheKey, leaves);
    res.json(leaves);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get leave by ID
export const getLeaveById = async (req: Request, res: Response) => {
  try {
    const cacheKey = `leave:${req.params.id}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      console.log('✅ [DATA SOURCE] Request served from Redis Cache');
      return res.json(cached);
    }
    console.log('🗄️ [DATA SOURCE] Fetching from MongoDB Database');
    const leave = await Leave.findById(req.params.id).populate('employee');
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    await setCache(cacheKey, leave);
    res.json(leave);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update leave
export const updateLeave = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!leave) {
      return res.status(404).json({ error: 'Leave not found' });
    }
    // Invalidate caches
    await deleteCache('leaves:all');
    await deleteCache(`leave:${req.params.id}`);
    res.json(leave);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Delete leave
export const deleteLeave = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findByIdAndDelete(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });
    // Invalidate caches
    await deleteCache('leaves:all');
    await deleteCache(`leave:${req.params.id}`);
    res.json({ message: 'Leave deleted' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Download leave document
export const downloadLeaveDocument = async (req: Request, res: Response) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave || !leave.documents) {
      return res.status(404).json({ error: 'Document not found' });
    }
    const originalUrl = leave.documents;
    const downloadUrl = originalUrl.replace('/upload/', '/upload/fl_attachment/');
    res.redirect(downloadUrl);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
