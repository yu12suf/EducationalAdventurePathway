import { Request, Response } from 'express';
import Scholarship from '../models/Scholarship';
import StudentProfile from '../models/StudentProfile';
import { rankScholarships, calculateMatchScore } from '../services/matching.service';

// @desc    Get all scholarships (public, with optional matching)
// @route   GET /api/scholarships
// @access  Public
export const getScholarships = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      country,
      degreeLevel,
      field,
      deadlineBefore,
      deadlineAfter,
      fundingType,
      keyword,
      studentId,                // optional
      limit = 20,
      page = 1,
    } = req.query;

    // Build filter object
    const filter: any = {};

    if (country) filter.country = country;
    if (degreeLevel) filter['eligibilityCriteria.degreeLevel'] = degreeLevel;
    if (field) filter['eligibilityCriteria.fieldOfStudy'] = field;
    if (fundingType) filter.fundingType = fundingType;
    if (deadlineBefore || deadlineAfter) {
      filter.deadline = {};
      if (deadlineBefore) filter.deadline.$lte = new Date(deadlineBefore as string);
      if (deadlineAfter) filter.deadline.$gte = new Date(deadlineAfter as string);
    }
    if (keyword) {
      filter.$text = { $search: keyword as string };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const scholarships = await Scholarship.find(filter)
      .sort({ deadline: 1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Scholarship.countDocuments(filter);

    let data = scholarships.map(s => s.toObject());

    // If studentId is provided, attempt to match
    if (studentId) {
      const student = await StudentProfile.findOne({ user: studentId });
      if (student) {
        const ranked = rankScholarships(student, scholarships);
        // Type assertion to bypass strict type check (ranked has same structure + matchScore)
        data = ranked as any;
      }
    }

    return res.json({
      success: true,
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single scholarship by ID (public, optionally with match score)
// @route   GET /api/scholarships/:id
// @access  Public
export const getScholarshipById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const scholarship = await Scholarship.findById(req.params['id']);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    scholarship.views += 1;
    await scholarship.save();

    let result: any = scholarship.toObject();

    // If studentId is provided, add match score
    const studentId = req.query['studentId'] as string;
    if (studentId) {
      const student = await StudentProfile.findOne({ user: studentId });
      if (student) {
        result.matchScore = calculateMatchScore(student, scholarship);
      }
    }

    return res.json({ success: true, data: result });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};