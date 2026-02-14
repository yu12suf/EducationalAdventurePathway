import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import api from '@/services/api';

interface ExtractedData {
  [key: string]: string | undefined;
}

// Helper to convert date to YYYY-MM-DD for input[type="date"]
const formatDateForInput = (dateStr: string): string => {
  dateStr = dateStr.trim();
  const parsed = Date.parse(dateStr);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split('T')[0];
  }
  const parts = dateStr.split(/[\/\-\.]/);
  if (parts.length === 3) {
    if (parts[0].length === 4) {
      return `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
    } else if (parts[2].length === 4) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }
  return dateStr;
};

// Map extracted field keys to form field names (or special handlers)
const fieldMapping: Record<string, (value: string, setValue: any) => void> = {
  name: (value, setValue) => {
    const parts = value.trim().split(/\s+/);
    if (parts.length >= 2) {
      setValue('firstName', parts[0]);
      setValue('lastName', parts.slice(1).join(' '));
    } else {
      setValue('firstName', value);
    }
  },
  firstName: (value, setValue) => setValue('firstName', value),
  lastName: (value, setValue) => setValue('lastName', value),
  nationality: (value, setValue) => setValue('nationality', value),
  dateOfBirth: (value, setValue) => setValue('dateOfBirth', formatDateForInput(value)),
  phone: (value, setValue) => setValue('phone', value),
  address: (value, setValue) => setValue('currentLocation', value),
  institution: (value, setValue) => setValue('academicHistory.0.institution', value),
  degree: (value, setValue) => setValue('academicHistory.0.degree', value),
  fieldOfStudy: (value, setValue) => setValue('academicHistory.0.fieldOfStudy', value),
  gpa: (value, setValue) => {
    const num = parseFloat(value);
    if (!isNaN(num)) setValue('academicHistory.0.gpa', num);
  },
  graduationYear: (value, setValue) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) setValue('academicHistory.0.graduationYear', num);
  },
};

export default function StepOcrUpload() {
  const { setValue } = useFormContext();
  const [uploading, setUploading] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);

    try {
      const response = await api.post('/api/documents/upload-ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const extractedData: ExtractedData = response.data.data;
      console.log('✅ Extracted data from backend:', extractedData);
      setExtracted(extractedData);

      // Loop through all extracted fields and apply mapping if available
      for (const [key, value] of Object.entries(extractedData)) {
        if (value) {
          if (fieldMapping[key]) {
            console.log(`🔹 Mapping key "${key}" with value "${value}"`);
            fieldMapping[key](value, setValue);
          } else {
            console.log(`⚠️ No mapping for key: "${key}" (value: "${value}")`);
          }
        }
      }
    } catch (err: any) {
      console.error('❌ OCR error:', err);
      setError(err.response?.data?.message || 'OCR processing failed');
    } finally {
      setUploading(false);
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'application/pdf': [],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Upload Your Transcript / Certificate</h2>
      <p className="text-sm text-gray-500">
        Upload a scanned copy of your academic document. We'll extract information and pre‑fill your profile.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Drop the file here...' : 'Drag & drop a file, or click to select'}
        </p>
        <p className="text-xs text-gray-500">Supported: PDF, JPEG, PNG (Max 50MB)</p>
      </div>

      {uploading && (
        <div className="flex items-center justify-center text-blue-600">
          <FaSpinner className="animate-spin mr-2" /> Processing document...
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {extracted && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2">✅ Document processed successfully</h3>
          <p className="text-sm text-green-700">
            We've extracted the following information and pre‑filled your profile. You can review and edit it in the next steps.
          </p>
          <div className="mt-3 text-xs text-green-600">
            {Object.entries(extracted).map(([key, value]) => (
              value && <div key={key}><span className="font-semibold">{key}:</span> {value}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}