export interface Scholarship {
  _id: string;
  title: string;
  provider: string;
  description: string;
  eligibilityCriteria: {
    nationality?: string[];
    gpa?: { min?: number; max?: number };
    fieldOfStudy?: string[];
    degreeLevel: string[];
    age?: { min?: number; max?: number };
    englishTest?: {
      ielts?: number;
      toefl?: number;
    };
    other?: string;
  };
  deadline: string;
  fundingType: 'full' | 'partial' | 'other';
  awardValue?: string;
  applicationFee?: number;
  requiredDocuments: string[];
  officialUrl: string;
  country: string;
  university?: string;
  trustScore: number;
  isVerified: boolean;
  tags: string[];
  views: number;
  applications: number;
  matchScore?: number; // added when studentId is provided
}