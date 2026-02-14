import { Request, Response } from 'express';
import StudentScholarship from '../models/StudentScholarship';
import Scholarship from '../models/Scholarship';
import { calculateMatchScore } from '../services/matching.service';
import StudentProfile from '../models/StudentProfile';

interface AuthRequest extends Request {
  user?: any;
}

// Helper: generate checklist from scholarship required documents
const generateChecklist = (scholarship: any, userSetDeadline?: Date) => {
  const tasks = scholarship.requiredDocuments.map((doc: string) => ({
    name: `Prepare ${doc}`,
    deadline: userSetDeadline,
    completed: false,
  }));
  tasks.push({
    name: 'Submit application',
    deadline: userSetDeadline,
    completed: false,
  });
  return { tasks };
};

// @desc    Save a scholarship for the logged-in student
// @route   POST /api/scholarships/:id/save
// @access  Private (student)
export const saveScholarship = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.user._id;
    const scholarshipId = req.params['id'] as string;
    if (!scholarshipId) {
      return res.status(400).json({ success: false, message: 'Scholarship ID is required' });
    }

    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    const existing = await StudentScholarship.findOne({ student: studentId, scholarship: scholarshipId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Scholarship already saved' });
    }

    const studentProfile = await StudentProfile.findOne({ user: studentId });
    let matchScore = 0;
    if (studentProfile) {
      matchScore = calculateMatchScore(studentProfile, scholarship);
    }

    const applicationWorkflow = generateChecklist(scholarship);

    const saved = await StudentScholarship.create({
      student: studentId,
      scholarship: scholarshipId,
      aiMatchScore: matchScore,
      applicationWorkflow,
    });

    return res.status(201).json({ success: true, data: saved });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Unsave (remove) a saved scholarship
// @route   DELETE /api/scholarships/:id/save
// @access  Private (student)
export const unsaveScholarship = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.user._id;
    const scholarshipId = req.params['id'] as string;
    if (!scholarshipId) {
      return res.status(400).json({ success: false, message: 'Scholarship ID is required' });
    }

    const deleted = await StudentScholarship.findOneAndDelete({ student: studentId, scholarship: scholarshipId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Saved scholarship not found' });
    }
    return res.json({ success: true, message: 'Scholarship removed from saved list' });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all saved scholarships for the logged-in student
// @route   GET /api/scholarships/saved
// @access  Private (student)
export const getSavedScholarships = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.user._id;
    const savedList = await StudentScholarship.find({ student: studentId })
      .populate('scholarship')
      .sort({ savedAt: -1 });

    return res.json({ success: true, data: savedList });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a saved scholarship (status, deadline, etc.)
// @route   PUT /api/scholarships/saved/:savedId
// @access  Private (student)
export const updateSavedScholarship = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.user._id;
    const savedId = req.params['savedId'] as string;
    if (!savedId) {
      return res.status(400).json({ success: false, message: 'Saved scholarship ID is required' });
    }

    const { trackingStatus, userSetDeadline, reminderLeadTime, appliedDate } = req.body;

    const saved = await StudentScholarship.findOne({ _id: savedId, student: studentId });
    if (!saved) {
      return res.status(404).json({ success: false, message: 'Saved scholarship not found' });
    }

    if (trackingStatus) saved.trackingStatus = trackingStatus;
    if (userSetDeadline) saved.userSetDeadline = new Date(userSetDeadline);
    if (reminderLeadTime !== undefined) saved.reminderLeadTime = reminderLeadTime;
    if (appliedDate) saved.appliedDate = new Date(appliedDate);

    await saved.save();

    return res.json({ success: true, data: saved });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a milestone to a saved scholarship
// @route   POST /api/scholarships/saved/:savedId/milestones
// @access  Private (student)
export const addMilestone = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.user._id;
    const savedId = req.params['savedId'] as string;
    if (!savedId) {
      return res.status(400).json({ success: false, message: 'Saved scholarship ID is required' });
    }

    const { title, targetDate } = req.body;
    if (!title || !targetDate) {
      return res.status(400).json({ success: false, message: 'Title and target date are required' });
    }

    const saved = await StudentScholarship.findOne({ _id: savedId, student: studentId });
    if (!saved) {
      return res.status(404).json({ success: false, message: 'Saved scholarship not found' });
    }

    if (!saved.milestones) {
      saved.milestones = [];
    }

    saved.milestones.push({
      title,
      targetDate: new Date(targetDate),
      completed: false,
    });

    await saved.save();

    return res.status(201).json({ success: true, data: saved.milestones });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a milestone (e.g., mark completed)
// @route   PUT /api/scholarships/saved/:savedId/milestones/:milestoneIdx
// @access  Private (student)
export const updateMilestone = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const studentId = req.user._id;
    const savedId = req.params['savedId'] as string;
    const idxParam = req.params['milestoneIdx'] as string;

    if (!savedId || !idxParam) {
      return res.status(400).json({ success: false, message: 'Saved ID and milestone index are required' });
    }

    const idx = parseInt(idxParam, 10);
    if (isNaN(idx)) {
      return res.status(400).json({ success: false, message: 'Invalid milestone index' });
    }

    const saved = await StudentScholarship.findOne({ _id: savedId, student: studentId });
    if (!saved) {
      return res.status(404).json({ success: false, message: 'Saved scholarship not found' });
    }

    if (!saved.milestones) {
      return res.status(404).json({ success: false, message: 'No milestones found for this saved scholarship' });
    }

    if (idx < 0 || idx >= saved.milestones.length) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const milestone = saved.milestones[idx];
    if (!milestone) {
      return res.status(404).json({ success: false, message: 'Milestone not found' });
    }

    const { completed, title, targetDate } = req.body;

    if (completed !== undefined) milestone.completed = completed;
    if (title) milestone.title = title;
    if (targetDate) milestone.targetDate = new Date(targetDate);
    if (completed && !milestone.completedAt) {
      milestone.completedAt = new Date();
    }

    await saved.save();

    return res.json({ success: true, data: milestone });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};