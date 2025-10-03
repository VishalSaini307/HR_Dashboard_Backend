import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Request, Response, NextFunction } from 'express';
import streamifier from 'streamifier';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});




const storage = multer.memoryStorage();
const upload = multer({ storage });


export const uploadFile = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'documents', maxCount: 1 }
]);

export const cloudinaryUpload = async (req: Request, res: Response, next: NextFunction) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = (files && (files['resume']?.[0] || files['documents']?.[0])) || null;
  if (!file) return next();

  try {
    return new Promise<void>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'leave-documents', resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(new Error('File upload failed'));
          }
          
          req.body.documents = result!.secure_url;
          req.body.resume = result!.secure_url;
            if (process.env.NODE_ENV !== 'production') {
              console.log('✅ Cloudinary upload success');
            }
          next();
          resolve();
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  } catch (err: any) {
    console.error(' Middleware error:', err);
    res.status(500).json({ error: 'File processing failed' });
  }
};