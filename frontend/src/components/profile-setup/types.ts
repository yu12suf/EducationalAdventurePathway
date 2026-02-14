export type StudyLevel = 'undergraduate' | 'master' | 'phd';

export interface AcademicHistoryEntry {
  level: 'highschool' | 'bachelor' | 'master' | 'phd';
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  gpa?: number;
  rawGrade?: string;
  graduationYear?: number;
  transcripts?: string[];
}

export interface StudyPreference {
  country: string;
  fieldOfStudy: string;
  degreeLevel: 'undergraduate' | 'master' | 'phd' | 'postdoc';
}

export interface StandardizedTest {
  ielts?: { overall: number; listening: number; reading: number; writing: number; speaking: number; testDate: Date };
  toefl?: { total: number; reading: number; listening: number; speaking: number; writing: number; testDate: Date };
  gre?: { verbal: number; quant: number; awa: number; testDate: Date };
}

export interface StudentProfileFormData {
  // Step 1: Study Level
  studyLevel: StudyLevel | null;

  // Step 2: Personal Info
  firstName: string;               // ✅ added
  lastName: string;                 // ✅ added
  nationality: string;
  currentLocation?: string;
  dateOfBirth?: Date;
  phone?: string;

  // Step 3: Academic History
  academicHistory: AcademicHistoryEntry[];

  // Step 4: Document upload (files) – handled separately
  uploadedDocuments: File[];

  // Step 5: Study Preferences
  studyPreferences: StudyPreference[];

  // Step 6: Funding & Tests
  fundingNeed?: boolean;
  englishProficiencyLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  standardizedTests: StandardizedTest;
}