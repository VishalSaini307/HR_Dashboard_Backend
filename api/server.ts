import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Simple test response
  res.json({
    message: "HR Dashboard Backend is working!",
    status: "OK", 
    timestamp: new Date().toISOString(),
    path: req.url
  });
}