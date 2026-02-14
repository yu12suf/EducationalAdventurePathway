import { Request, Response } from 'express';
import Scholarship from '../../models/Scholarship';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Create a new scholarship
// @route   POST /api/admin/scholarships
// @access  Private/Admin
export const createScholarship = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const scholarshipData = { ...req.body, createdBy: req.user?._id };
    const scholarship = await Scholarship.create(scholarshipData);
    return res.status(201).json({ success: true, data: scholarship });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all scholarships (admin view)
// @route   GET /api/admin/scholarships
// @access  Private/Admin
export const getAllScholarships = async (_req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: scholarships });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single scholarship by ID (admin view)
// @route   GET /api/admin/scholarships/:id
// @access  Private/Admin
export const getScholarshipById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const scholarship = await Scholarship.findById(req.params['id']);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    return res.json({ success: true, data: scholarship });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a scholarship
// @route   PUT /api/admin/scholarships/:id
// @access  Private/Admin
export const updateScholarship = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params['id'],
      req.body,
      { new: true, runValidators: true }
    );
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    return res.json({ success: true, data: scholarship });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a scholarship
// @route   DELETE /api/admin/scholarships/:id
// @access  Private/Admin
export const deleteScholarship = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params['id']);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }
    return res.json({ success: true, message: 'Scholarship deleted' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};