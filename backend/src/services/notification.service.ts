import StudentScholarship from '../models/StudentScholarship';
import Notification from '../models/Notification';
import User from '../models/User';
import { sendEmail } from '../utils/email';
import { IScholarship } from '../models/Scholarship';

// Helper: calculate days until deadline
const daysUntil = (date: Date): number => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Main function to check deadlines and send notifications
export const checkDeadlinesAndNotify = async () => {
  try {
    console.log('🔍 Checking for approaching scholarship deadlines...');

    // Find all saved scholarships that have a userSetDeadline
    const savedScholarships = await StudentScholarship.find({
      userSetDeadline: { $exists: true, $ne: null },
    })
      .populate<{ student: any; scholarship: IScholarship }>('student scholarship')
      .exec();

    for (const saved of savedScholarships) {
      const deadline = saved.userSetDeadline;
      if (!deadline) continue;

      const leadTime = saved.reminderLeadTime || 7;
      const daysLeft = daysUntil(deadline);

      if (daysLeft > 0 && daysLeft <= leadTime) {
        // Check if notification already sent
        const existing = await Notification.findOne({
          user: saved.student._id,
          referenceId: saved._id,
          category: 'deadline',
          'metadata.deadline': deadline,
        });

        if (existing) continue;

        // Create in‑app notification
        await Notification.create({
          user: saved.student._id,
          category: 'deadline',
          title: 'Scholarship Deadline Approaching',
          message: `Your saved scholarship "${saved.scholarship.title}" deadline is in ${daysLeft} day(s).`,
          referenceId: saved._id,
          metadata: {
            scholarshipId: saved.scholarship._id,
            deadline,
            daysLeft,
          },
        });

        // Send email
        const student = await User.findById(saved.student._id);
        if (student && student.email) {
          const emailHtml = `
            <h2>Deadline Reminder</h2>
            <p>Hello ${student.firstName},</p>
            <p>This is a reminder that your saved scholarship <strong>"${saved.scholarship.title}"</strong> has a deadline on <strong>${deadline.toDateString()}</strong> (in ${daysLeft} days).</p>
            <p>Visit your dashboard to prepare your application.</p>
          `;
          await sendEmail(
            student.email,
            'Scholarship Deadline Reminder',
            emailHtml
          ).catch(err => console.error('Email send failed:', err));
        }

        console.log(`✅ Notification sent for scholarship ${saved.scholarship._id}`);
      }
    }
  } catch (error) {
    console.error('Error in deadline check:', error);
  }
};