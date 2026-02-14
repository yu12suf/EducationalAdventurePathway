import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { performOcr, extractFields } from '../services/ocr.service';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Configure multer for temporary file storage
const upload = multer({
  dest: path.join(__dirname, '../../uploads/'),
  limits: { fileSize: 50 * 1024 * 1024 }, // ✅ increased to 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.') as any, false);
    }
  },
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// POST /api/documents/upload-ocr
router.post('/upload-ocr', protect, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // Perform OCR
    const ocrText = await performOcr(filePath, mimeType);

    // Extract structured fields
    const extracted = extractFields(ocrText);

    return res.json({
      success: true,
      data: extracted,
      rawText: ocrText, // optional, for debugging
    });
  } catch (error: any) {
    console.error('OCR error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default router;