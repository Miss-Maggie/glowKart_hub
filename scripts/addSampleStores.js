// Simple script to add sample stores to the database
const mongoose = require('mongoose');
require('dotenv').config({ path: './backend/.env' });

// MongoDB connection string (adjust if needed)
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/glowkart';

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

// Define Store model
const storeSchema = new mongoose.Schema({
  name: String,
  category: String,
  location: String,
  description: String,
  images: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Store = mongoose.model('Store', storeSchema);

// Sample stores data
const sampleStores = [
  {
    name: "Organic Delights",
    category: "Food & Dining",
    location: "123 Main Street, Nairobi",
    description: "Fresh organic produce and healthy meals"
  },
  {
    name: "Tech Haven",
    category: "Technology",
    location: "456 Tech Plaza, Nairobi",
    description: "Latest gadgets and tech accessories"
  },
  {
    name: "Green Thumb Nursery",
    category: "Home & Garden",
    location: "789 Garden Road, Nairobi",
    description: "Indoor plants and gardening supplies"
  },
  {
    name: "Beauty Bliss",
    category: "Beauty & Personal Care",
    location: "321 Beauty Avenue, Nairobi",
    description: "Natural beauty products and spa services"
  }
];

// Add sample stores
const addSampleStores = async () => {
  try {
    // Wait for the connection to be established
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    db.once('open', async () => {
      console.log('Connected to MongoDB');
      
      // Find the admin user to be the owner of stores
      const adminUser = await User.findOne({ email: 'admin@glowkart.com' });
      
      if (!adminUser) {
        console.log('Admin user not found. Please run createAdminUser.js first.');
        mongoose.connection.close();
        return;
      }
      
      console.log(`Found admin user: ${adminUser.name} (${adminUser.email})`);
      
      // Clear existing stores
      await Store.deleteMany({});
      console.log('Cleared existing stores');
      
      // Add owner to each store
      const storesWithOwner = sampleStores.map(store => ({
        ...store,
        owner: adminUser._id
      }));
      
      // Add sample stores
      const insertedStores = await Store.insertMany(storesWithOwner);
      
      console.log(`Sample stores added successfully! Inserted ${insertedStores.length} stores.`);
      
      // Display the created stores with their IDs
      console.log('\nCreated stores with IDs:');
      insertedStores.forEach(store => {
        console.log(`- ${store.name} (ID: ${store._id})`);
      });
      
      // Save store IDs to a file for use in addSampleProducts.js
      const fs = require('fs');
      const storeIds = insertedStores.map(store => store._id.toString());
      fs.writeFileSync('./scripts/storeIds.json', JSON.stringify(storeIds, null, 2));
      console.log('\nStore IDs saved to ./scripts/storeIds.json');
      
      mongoose.connection.close();
    });
  } catch (error) {
    console.error('Error adding sample stores:', error);
    mongoose.connection.close();
  }
};

addSampleStores();