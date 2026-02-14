import { IStudentProfile } from '../models/StudentProfile';
import { IScholarship } from '../models/Scholarship';

// Default weights (adjust as needed)
const DEFAULT_WEIGHTS = {
  studyLevel: 0.3,      // 30%
  fieldOfStudy: 0.25,   // 25%
  nationality: 0.15,    // 15%
  gpa: 0.2,             // 20%
  english: 0.1,         // 10%
};

// Helper: check if a value is in an array (case‑insensitive)
const matchesArray = (studentValue: string | undefined, scholarshipValues: string[] = []): boolean => {
  if (!studentValue || scholarshipValues.length === 0) return true; // no restriction → match
  return scholarshipValues.some(v => v.toLowerCase() === studentValue.toLowerCase());
};

// Helper: check GPA
const matchesGpa = (studentGpa: number | undefined, gpaReq?: { min?: number; max?: number }): boolean => {
  if (!gpaReq || (gpaReq.min === undefined && gpaReq.max === undefined)) return true;
  if (studentGpa === undefined) return false; // student has no GPA
  if (gpaReq.min !== undefined && studentGpa < gpaReq.min) return false;
  if (gpaReq.max !== undefined && studentGpa > gpaReq.max) return false;
  return true;
};

// Helper: check English test (IELTS/TOEFL)
const matchesEnglish = (
  studentIelts?: number,
  studentToefl?: number,
  englishReq?: { ielts?: number; toefl?: number }
): boolean => {
  if (!englishReq || (englishReq.ielts === undefined && englishReq.toefl === undefined)) return true;
  if (englishReq.ielts !== undefined && (!studentIelts || studentIelts < englishReq.ielts)) return false;
  if (englishReq.toefl !== undefined && (!studentToefl || studentToefl < englishReq.toefl)) return false;
  return true;
};

// Main scoring function (returns a score between 0 and 100)
export const calculateMatchScore = (
  student: IStudentProfile,
  scholarship: IScholarship,
  weights = DEFAULT_WEIGHTS
): number => {
  let totalScore = 0;
  let totalWeight = 0;

  // 1. Study level
  const studentLevel = student.studyPreferences?.[0]?.degreeLevel; // take first preference
  if (studentLevel) {
    totalWeight += weights.studyLevel;
    if (scholarship.eligibilityCriteria.degreeLevel.includes(studentLevel as any)) {
      totalScore += weights.studyLevel;
    }
  }

  // 2. Field of study (match any of student's preferences)
  const studentFields = student.studyPreferences?.map(p => p.fieldOfStudy) || [];
  if (studentFields.length > 0) {
    totalWeight += weights.fieldOfStudy;
    const fieldMatch = studentFields.some(field =>
      matchesArray(field, scholarship.eligibilityCriteria.fieldOfStudy)
    );
    if (fieldMatch) totalScore += weights.fieldOfStudy;
  }

  // 3. Nationality
  if (student.nationality) {
    totalWeight += weights.nationality;
    if (matchesArray(student.nationality, scholarship.eligibilityCriteria.nationality)) {
      totalScore += weights.nationality;
    }
  }

  // 4. GPA (use the most recent academic history entry)
  const latestGpa = student.academicHistory?.find(entry => entry.gpa !== undefined)?.gpa;
  if (latestGpa !== undefined) {
    totalWeight += weights.gpa;
    if (matchesGpa(latestGpa, scholarship.eligibilityCriteria.gpa)) {
      totalScore += weights.gpa;
    }
  } else if (scholarship.eligibilityCriteria.gpa?.min !== undefined) {
    // Student has no GPA but scholarship requires one → penalty (weight still counted as failure)
    totalWeight += weights.gpa;
    // no score added
  }

  // 5. English test (use the best available)
  const ielts = student.standardizedTests?.ielts?.overall;
  const toefl = student.standardizedTests?.toefl?.total;
  if (ielts !== undefined || toefl !== undefined) {
    totalWeight += weights.english;
    if (matchesEnglish(ielts, toefl, scholarship.eligibilityCriteria.englishTest)) {
      totalScore += weights.english;
    }
  } else if (scholarship.eligibilityCriteria.englishTest?.ielts || scholarship.eligibilityCriteria.englishTest?.toefl) {
    totalWeight += weights.english; // penalty
  }

  // Avoid division by zero
  if (totalWeight === 0) return 0;

  // Normalise to 0-100
  return Math.round((totalScore / totalWeight) * 100);
};

// Rank scholarships by match score (descending)
export const rankScholarships = (
  student: IStudentProfile,
  scholarships: IScholarship[]
): (IScholarship & { matchScore: number })[] => {
  return scholarships
    .map(scholarship => ({
      ...scholarship.toObject(),
      matchScore: calculateMatchScore(student, scholarship),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
};