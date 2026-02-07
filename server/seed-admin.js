import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wall';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || 'ashish123';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      existingAdmin.password = DEFAULT_PASSWORD;
      await existingAdmin.save();
      console.log('✓ Admin password updated successfully!');
    } else {
      console.log('Creating new admin user...');
      const admin = new Admin({
        username: 'admin',
        password: DEFAULT_PASSWORD
      });
      await admin.save();
      console.log('✓ Admin user created successfully!');
    }

    console.log('\nAdmin credentials:');
    console.log('Username: admin');
    console.log('Password:', DEFAULT_PASSWORD);
    console.log('\n⚠️  Change the ADMIN_PASSWORD in .env for production!\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
