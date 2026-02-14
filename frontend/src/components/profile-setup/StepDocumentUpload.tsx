import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { FaCloudUploadAlt } from 'react-icons/fa';

export default function StepDocumentUpload() {
  const { setValue, watch } = useFormContext();
  const uploadedFiles = watch('uploadedDocuments') || [];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Store files in form state
    setValue('uploadedDocuments', [...uploadedFiles, ...acceptedFiles]);

    // Simulate OCR – in production, upload to server and get extracted data
    acceptedFiles.forEach(async (file) => {
      // Create FormData and send to /api/documents/upload
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/documents/upload', { method: 'POST', body: formData });
        const data = await res.json();
        // Pre-fill form fields with extracted data (e.g., institution, degree, GPA)
        // We'll need to map extracted data to appropriate fields
        console.log('OCR result:', data);
        // Example: if (data.institution) setValue('academicHistory.0.institution', data.institution);
      } catch (err) {
        console.error('OCR failed', err);
      }
    });
  }, [setValue, uploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [], 'application/pdf': [] } });

  const removeFile = (index: number) => {
    setValue('uploadedDocuments', uploadedFiles.filter((_: any, i: number) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Upload Documents (Optional)</h2>
      <p className="text-sm text-gray-500">
        Upload your transcripts, certificates, or CV. We'll extract information to auto‑fill your profile.
      </p>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500">Supported: PDF, JPEG, PNG (Max 10MB)</p>
      </div>

      {uploadedFiles.length > 0 && (
        <ul className="mt-4 space-y-2">
          {uploadedFiles.map((file: File, index: number) => (
            <li key={index} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
              <span className="truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}