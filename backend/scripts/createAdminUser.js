const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Define User schema
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['shopper', 'vendor', 'admin'],
      default: 'shopper',
    },
  }, { timestamps: true });

  // Create User model
  const User = mongoose.model('User', userSchema);

  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@glowkart.com' });

    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@glowkart.com',
      password: '$2a$10$rOz7/9.3J5.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3.3', // bcrypt hash of 'admin123'
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@glowkart.com');
    console.log('Password: admin123');
    console.log('Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
});
