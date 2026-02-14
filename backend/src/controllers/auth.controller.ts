import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import CounselorProfile from '../models/CounselorProfile';
import { generateToken, generateVerificationToken, generateResetToken, verifyToken } from '../utils/token';
import { sendEmail } from '../utils/email';

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      emailVerified: false,
    });

    if (role === 'student') {
      await StudentProfile.create({ user: user._id });
    } else if (role === 'counselor') {
      await CounselorProfile.create({
        user: user._id,
        bio: '',
        areasOfExpertise: [],
        university: '',
        degree: '',
        yearsOfExperience: 0,
        languages: [],
        consultationModes: [],
        verificationStatus: 'pending',
        isVisible: false,
      });
    }

    const verificationToken = generateVerificationToken(user._id.toString());
    const frontendUrl = process.env['FRONTEND_URL'] as string;
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    await sendEmail(
      email,
      'Verify your email address',
      `<p>Hello ${firstName},</p><p>Please click <a href="${verificationLink}">here</a> to verify your email address.</p>`
    );

    const token = generateToken(user._id.toString(), user.role);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      message: 'Registration successful. Please verify your email.',
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString(), user.role);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        emailVerified: user.emailVerified,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token } = req.body;

    const decoded = verifyToken(token, process.env['JWT_VERIFY_SECRET'] as string);
    if (!decoded) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.emailVerified) {
      return res.json({ success: true, message: 'Email already verified' });
    }

    user.emailVerified = true;
    await user.save();

    return res.json({ success: true, message: 'Email verified successfully' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const resetToken = generateResetToken(user._id.toString());
    const frontendUrl = process.env['FRONTEND_URL'] as string;
    const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendEmail(
      email,
      'Password Reset Request',
      `<p>Hello ${user.firstName},</p><p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`
    );

    return res.json({ success: true, message: 'Password reset email sent' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { token, newPassword } = req.body;

    const decoded = verifyToken(token, process.env['JWT_RESET_SECRET'] as string);
    if (!decoded) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: any, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    let profileCompleted = false;
    if (user?.role === 'student') {
      const profile = await StudentProfile.findOne({ user: user._id });
      profileCompleted = (profile?.profileCompletionPercentage ?? 0) >= 80;
    }

    return res.json({
      success: true,
      user,
      profileCompleted,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};