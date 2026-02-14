import { Request, Response } from 'express';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';

// Extend Request to include user property from auth middleware
interface AuthRequest extends Request {
  user?: any;
}

// @desc    Update student profile
// @route   PUT /api/student/profile
// @access  Private (student only)
export const updateStudentProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      firstName,
      lastName,
      nationality,
      currentLocation,
      dateOfBirth,
      phone,
      academicHistory,
      studyPreferences,
      fundingNeed,
      englishProficiencyLevel,
      standardizedTests,
    } = req.body;

    // Update user's name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    await user.save();

    // Update or create student profile
    let profile = await StudentProfile.findOne({ user: userId });
    if (!profile) {
      profile = new StudentProfile({ user: userId });
    }

    profile.nationality = nationality || profile.nationality;
    profile.currentLocation = currentLocation || profile.currentLocation;
    if (dateOfBirth) {
      profile.dateOfBirth = new Date(dateOfBirth);
    }
    profile.phone = phone || profile.phone;
    profile.academicHistory = academicHistory || profile.academicHistory;
    profile.studyPreferences = studyPreferences || profile.studyPreferences;
    if (fundingNeed !== undefined) {
      profile.fundingNeed = fundingNeed;
    }
    profile.englishProficiencyLevel = englishProficiencyLevel || profile.englishProficiencyLevel;
    profile.standardizedTests = standardizedTests || profile.standardizedTests;

    await profile.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};