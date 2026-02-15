'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { scholarshipService } from '@/services/scholarship.service';
import { Scholarship } from '@/types/scholarship';
import Button from '@/components/ui/Button';
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaExternalLinkAlt } from 'react-icons/fa';

export default function ScholarshipDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await scholarshipService.getScholarshipById(
          id as string,
          user?.id // pass studentId if logged in
        );
        setScholarship(data.data);
        if (user) {
          // Check if saved
          const saved = await scholarshipService.getSavedScholarships();
          const savedIds = saved.data.map((s: any) => s.scholarship._id);
          setIsSaved(savedIds.includes(id));
        }
      } catch (error) {
        console.error('Failed to fetch scholarship', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleSaveToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    try {
      if (isSaved) {
        await scholarshipService.unsaveScholarship(id as string);
        setIsSaved(false);
      } else {
        await scholarshipService.saveScholarship(id as string);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Failed to toggle save', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Scholarship not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center text-gray-600 hover:text-blue-600"
        >
          <FaArrowLeft className="mr-2" /> Back to scholarships
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{scholarship.title}</h1>
              <p className="mt-1 text-lg text-gray-600">
                {scholarship.provider} · {scholarship.country}
                {scholarship.university && ` · ${scholarship.university}`}
              </p>
            </div>
            <button
              onClick={handleSaveToggle}
              className={`p-2 rounded-full ${
                isSaved ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              {isSaved ? <FaBookmark className="h-6 w-6" /> : <FaRegBookmark className="h-6 w-6" />}
            </button>
          </div>

          {/* Match Score (if available) */}
          {scholarship.matchScore !== undefined && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-100">
              <span className="text-green-700 font-medium">
                Match Score: {scholarship.matchScore}%
              </span>
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{scholarship.description}</p>
            </div>

            {/* Eligibility */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Eligibility</h2>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {scholarship.eligibilityCriteria.degreeLevel?.length > 0 && (
                  <li>
                    <span className="font-medium">Degree levels:</span>{' '}
                    {scholarship.eligibilityCriteria.degreeLevel.join(', ')}
                  </li>
                )}
                {scholarship.eligibilityCriteria.nationality &&
                  scholarship.eligibilityCriteria.nationality.length > 0 && (
                    <li>
                      <span className="font-medium">Nationality:</span>{' '}
                      {scholarship.eligibilityCriteria.nationality.join(', ')}
                    </li>
                  )}
                {scholarship.eligibilityCriteria.fieldOfStudy &&
                  scholarship.eligibilityCriteria.fieldOfStudy.length > 0 && (
                    <li>
                      <span className="font-medium">Field of study:</span>{' '}
                      {scholarship.eligibilityCriteria.fieldOfStudy.join(', ')}
                    </li>
                  )}
                {scholarship.eligibilityCriteria.gpa && (
                  <li>
                    <span className="font-medium">GPA:</span> Minimum{' '}
                    {scholarship.eligibilityCriteria.gpa.min}
                    {scholarship.eligibilityCriteria.gpa.max &&
                      ` - ${scholarship.eligibilityCriteria.gpa.max}`}
                  </li>
                )}
                {scholarship.eligibilityCriteria.englishTest && (
                  <li>
                    <span className="font-medium">English test:</span>{' '}
                    {scholarship.eligibilityCriteria.englishTest.ielts &&
                      `IELTS ${scholarship.eligibilityCriteria.englishTest.ielts}`}
                    {scholarship.eligibilityCriteria.englishTest.toefl &&
                      ` TOEFL ${scholarship.eligibilityCriteria.englishTest.toefl}`}
                  </li>
                )}
                {scholarship.eligibilityCriteria.other && (
                  <li>{scholarship.eligibilityCriteria.other}</li>
                )}
              </ul>
            </div>

            {/* Funding & Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Funding</h2>
                <p className="text-gray-700">
                  <span className="font-medium">Type:</span>{' '}
                  {scholarship.fundingType === 'full'
                    ? 'Fully Funded'
                    : scholarship.fundingType === 'partial'
                    ? 'Partially Funded'
                    : 'Other'}
                </p>
                {scholarship.awardValue && (
                  <p className="text-gray-700">
                    <span className="font-medium">Award:</span> {scholarship.awardValue}
                  </p>
                )}
                {scholarship.applicationFee && (
                  <p className="text-gray-700">
                    <span className="font-medium">Application fee:</span> $
                    {scholarship.applicationFee}
                  </p>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Required Documents</h2>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {scholarship.requiredDocuments.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tags */}
            {scholarship.tags.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {scholarship.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Deadline & Apply */}
            <div className="border-t pt-4 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-lg font-medium text-gray-700">
                Deadline:{' '}
                <span className="text-red-600">
                  {new Date(scholarship.deadline).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </p>
              <a
                href={scholarship.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
              >
                Apply Now <FaExternalLinkAlt className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}