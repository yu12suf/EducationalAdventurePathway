import cron from 'node-cron';
import { checkDeadlinesAndNotify } from '../services/notification.service';

// Schedule the job to run every day at 8:00 AM
export const startDeadlineReminderJob = () => {
  // Cron expression: minute hour day-of-month month day-of-week
  // 0 8 * * * = at 08:00 every day
  cron.schedule('0 8 * * *', async () => {
    console.log('⏰ Running deadline reminder job...');
    await checkDeadlinesAndNotify();
  });

  // Also run once immediately on startup (optional)
  setTimeout(() => {
    console.log('🚀 Running initial deadline check...');
    checkDeadlinesAndNotify();
  }, 5000); // wait 5 seconds for server to fully start
};