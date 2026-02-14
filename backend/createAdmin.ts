import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env['MONGODB_URI'] as string;

mongoose.connect(MONGODB_URI)
  .then(async () => {
    const hashed = await bcrypt.hash('yuusuf12345kadiir', 10);
    const admin = new User({
      email: 'yuusufkadiir258@gmail.com',
      password: hashed,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      emailVerified: true,
    });
    await admin.save();
    console.log('Admin created');
    process.exit();
  })
  .catch((err: Error) => {
    console.error(err);
    process.exit(1);
  });