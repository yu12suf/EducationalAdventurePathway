import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';

// Embedded sub‑schemas
interface IAcademicHistory {
  level: 'highschool' | 'bachelor' | 'master' | 'phd';
  institution: string;
  degree?: string;
  fieldOfStudy?: string;
  gpa?: number;
  rawGrade?: string;
  graduationYear?: number;
  transcripts?: string[];
}

interface IStudyPreference {
  country: string;
  fieldOfStudy: string;
  degreeLevel: 'undergraduate' | 'master' | 'phd' | 'postdoc';
}

export interface IStudentProfile extends Document {
  user: IUser['_id'];
  nationality?: string;          // 👈 now optional (collected later)
  currentLocation?: string;
  dateOfBirth?: Date;
  phone?: string;
  academicHistory: IAcademicHistory[];
  studyPreferences: IStudyPreference[];
  fundingNeed?: boolean;
  englishProficiencyLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  standardizedTests: {
    ielts?: { overall: number; listening: number; reading: number; writing: number; speaking: number; testDate: Date };
    toefl?: { total: number; reading: number; listening: number; speaking: number; writing: number; testDate: Date };
    gre?: { verbal: number; quant: number; awa: number; testDate: Date };
  };
  profileCompletionPercentage: number;
}

const AcademicHistorySchema = new Schema<IAcademicHistory>(
  {
    level: { type: String, enum: ['highschool', 'bachelor', 'master', 'phd'], required: true },
    institution: { type: String, required: true },
    degree: String,
    fieldOfStudy: String,
    gpa: { type: Number, min: 0, max: 4.0 },
    rawGrade: String,
    graduationYear: Number,
    transcripts: [String],
  },
  { _id: false }
);

const StudyPreferenceSchema = new Schema<IStudyPreference>(
  {
    country: { type: String, required: true },
    fieldOfStudy: { type: String, required: true },
    degreeLevel: { type: String, enum: ['undergraduate', 'master', 'phd', 'postdoc'], required: true },
  },
  { _id: false }
);

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    nationality: { type: String },               // 👈 removed `required: true`
    currentLocation: String,
    dateOfBirth: Date,
    phone: String,
    academicHistory: [AcademicHistorySchema],
    studyPreferences: [StudyPreferenceSchema],
    fundingNeed: { type: Boolean, default: false },
    englishProficiencyLevel: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] },
    standardizedTests: {
      ielts: {
        overall: Number,
        listening: Number,
        reading: Number,
        writing: Number,
        speaking: Number,
        testDate: Date,
      },
      toefl: {
        total: Number,
        reading: Number,
        listening: Number,
        speaking: Number,
        writing: Number,
        testDate: Date,
      },
      gre: {
        verbal: Number,
        quant: Number,
        awa: Number,
        testDate: Date,
      },
    },
    profileCompletionPercentage: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

// ----- Async pre-save hook – auto-calculate profile completion percentage -----
StudentProfileSchema.pre('save', async function (this: IStudentProfile) {
  let totalFields = 0;
  let filledFields = 0;

  const fieldsToCheck = [
    'nationality',
    'currentLocation',
    'dateOfBirth',
    'phone',
    'academicHistory',
    'studyPreferences',
    'fundingNeed',
    'englishProficiencyLevel',
    'standardizedTests.ielts',
    'standardizedTests.toefl',
    'standardizedTests.gre',
  ];

  fieldsToCheck.forEach((field) => {
    totalFields++;
    const value = this.get(field);
    if (value) {
      if (Array.isArray(value)) {
        if (value.length > 0) filledFields++;
      } else {
        filledFields++;
      }
    }
  });

  this.profileCompletionPercentage = Math.round((filledFields / totalFields) * 100);
});

// ----- Indexes -----
// ❌ REMOVED: StudentProfileSchema.index({ user: 1 }); – duplicate (already from unique: true)
// ✅ Keep this compound index for efficient querying on study preferences
StudentProfileSchema.index({ 'studyPreferences.country': 1, 'studyPreferences.fieldOfStudy': 1 });

export default mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);