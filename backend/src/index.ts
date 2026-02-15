import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
//import testRoutes from './routes/test';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import studentRoutes from './routes/student.routes';
import counselorRoutes from './routes/counselor.routes';
import adminScholarshipRoutes from './routes/admin/scholarship.routes';
import scholarshipRoutes from './routes/scholarship.routes';
import savedScholarshipRoutes from './routes/savedScholarship.routes';
import { startDeadlineReminderJob } from './jobs/deadlineReminder.job';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional but good

// Connect to MongoDB
connectDB();


// Basic route
app.get('/', (_req, res) => {
  res.send('Educational Adventure Pathway API is running...');
});

app.use('/api/auth', authRoutes);

//app.use('/api/test', testRoutes);   // ✅ mounted here
app.use('/api/documents', documentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/admin/scholarships', adminScholarshipRoutes);
app.use('/api/scholarships', savedScholarshipRoutes);
app.use('/api/scholarships', scholarshipRoutes);
app.use('/api/notifications', notificationRoutes);
// Start background jobs
startDeadlineReminderJob();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});