import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import testRoutes from './routes/test';
import authRoutes from './routes/auth.routes';
import documentRoutes from './routes/document.routes';
import studentRoutes from './routes/student.routes';
import counselorRoutes from './routes/counselor.routes';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();


// Basic route
app.get('/', (_req, res) => {
  res.send('Educational Adventure Pathway API is running...');
});

app.use('/api/auth', authRoutes);

app.use('/api/test', testRoutes);   // ✅ mounted here
app.use('/api/documents', documentRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/counselor', counselorRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});