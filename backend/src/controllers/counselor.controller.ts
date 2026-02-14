import { Request, Response } from 'express';
import User from '../models/User';
import CounselorProfile from '../models/CounselorProfile';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Update counselor profile
// @route   PUT /api/counselor/profile
// @access  Private (counselor only)
export const updateCounselorProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const {
      bio,
      areasOfExpertise,
      university,
      degree,
      yearsOfExperience,
      languages,
      consultationModes,
      hourlyRate,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update or create counselor profile
    let profile = await CounselorProfile.findOne({ user: userId });
    if (!profile) {
      profile = new CounselorProfile({ user: userId });
    }

    profile.bio = bio || profile.bio;
    profile.areasOfExpertise = areasOfExpertise || profile.areasOfExpertise;
    profile.university = university || profile.university;
    profile.degree = degree || profile.degree;
    if (yearsOfExperience !== undefined) {
      profile.yearsOfExperience = yearsOfExperience;
    }
    profile.languages = languages || profile.languages;
    profile.consultationModes = consultationModes || profile.consultationModes;
    if (hourlyRate !== undefined) {
      profile.hourlyRate = hourlyRate;
    }

    await profile.save();

    return res.json({
      success: true,
      message: 'Counselor profile updated successfully',
      profile,
    });
  } catch (error: any) {
    console.error('Counselor profile update error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};