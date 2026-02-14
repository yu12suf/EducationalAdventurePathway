export type ConsultationMode = 'chat' | 'audio' | 'video';

export interface CounselorProfileData {
  bio: string;
  areasOfExpertise: string[];
  university: string;
  degree: string;
  yearsOfExperience: number;
  languages: string[];
  consultationModes: ConsultationMode[];
  hourlyRate?: number; // optional
}