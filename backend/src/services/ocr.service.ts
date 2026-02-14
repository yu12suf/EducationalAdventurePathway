import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import fs from 'fs/promises';

// Use require for pdf-parse-new
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdfParse = require('pdf-parse-new');

const cleanup = async (filePath: string) => {
  try {
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Cleanup error:', err);
  }
};

const extractPdfText = async (filePath: string): Promise<string> => {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
};

const extractImageText = async (filePath: string): Promise<string> => {
  const processedPath = filePath + '_processed.png';
  await sharp(filePath)
    .grayscale()
    .normalise()
    .toFile(processedPath);

  const { data: { text } } = await Tesseract.recognize(processedPath, 'eng', {
    logger: m => console.log(m),
  });

  await cleanup(processedPath);
  return text;
};

export const performOcr = async (filePath: string, mimeType: string): Promise<string> => {
  try {
    if (mimeType === 'application/pdf') return await extractPdfText(filePath);
    if (mimeType.startsWith('image/')) return await extractImageText(filePath);
    throw new Error('Unsupported file type');
  } finally {
    await cleanup(filePath);
  }
};

export const extractFields = (text: string) => {
  console.log('--- OCR Text (first 1000 chars) ---');
  console.log(text.substring(0, 1000));
  console.log('-----------------------------------');

  const lines = text.split('\n').map(line => line.trim()).filter((line): line is string => line.length > 0);
  const extracted: Record<string, string> = {};

  // Helper to extract English part after pipe (if present)
  const extractEnglish = (line: string): string | null => {
    const parts = line.split('|');
    if (parts.length > 1) {
      return parts[1]!.trim(); // non-null assertion: parts[1] is defined because length > 1
    }
    return null;
  };

  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue; // safety check

    // Try to extract name (first line often contains full name)
    if (i === 0 && !extracted['name']) {
      const englishName = extractEnglish(line);
      if (englishName) {
        extracted['name'] = englishName;
      } else {
        // If no pipe, check if line contains two or more capitalized words
        const words = line.match(/\b[A-Z][a-z]+\b/g);
        if (words && words.length >= 2) {
          extracted['name'] = line;
        }
      }
    }

    // Date of birth detection: line contains a slash and a year pattern
    if (!extracted['dateOfBirth'] && (line.includes('/') || line.includes('-'))) {
      const dateMatch = line.match(/\b(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})\b/);
      if (dateMatch && dateMatch[1]) {
        extracted['dateOfBirth'] = dateMatch[1];
      } else {
        // Try to capture the first date-like token
        const tokens = line.split(/\s+/);
        for (const token of tokens) {
          if (token.match(/^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/)) {
            extracted['dateOfBirth'] = token;
            break;
          }
        }
      }
    }

    // Phone number detection
    if (!extracted['phone']) {
      const phoneMatch = line.match(/\b0\d{9}\b/);
      if (phoneMatch && phoneMatch[0]) {
        extracted['phone'] = phoneMatch[0];
      }
    }

    // Nationality detection
    if (!extracted['nationality']) {
      if (line.toLowerCase().includes('ethiopian')) {
        extracted['nationality'] = 'Ethiopian';
      } else {
        const eng = extractEnglish(line);
        if (eng && eng.toLowerCase().includes('ethiopian')) {
          extracted['nationality'] = 'Ethiopian';
        }
      }
    }

    // Gender detection (optional, not used in profile but could be)
    if (!extracted['gender']) {
      if (line.toLowerCase().includes('male')) {
        extracted['gender'] = 'Male';
      } else if (line.toLowerCase().includes('female')) {
        extracted['gender'] = 'Female';
      }
    }

    // Address / location detection
    if (!extracted['address'] && line.match(/[A-Za-z]+/)) {
      const locationWords = line.match(/\b[A-Z][a-z]+\b/g);
      if (locationWords && locationWords.length > 0) {
        extracted['address'] = line;
      }
    }
  }

  // If we still have no name, try a fallback that looks for capitalized words
  if (!extracted['name']) {
    const nameLine = lines.find(l => {
      const words = l.match(/\b[A-Z][a-z]+\b/g);
      return words && words.length >= 2;
    });
    if (nameLine) {
      const englishName = extractEnglish(nameLine) || nameLine;
      extracted['name'] = englishName;
    }
  }

  return extracted;
};