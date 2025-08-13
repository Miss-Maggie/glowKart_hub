// Simple script to add sample products to the database
const mongoose = require('mongoose');
const fs = require('fs');

// MongoDB connection string (adjust if needed)
const mongoUri = 'mongodb://localhost:27017/glowkart';

// Connect to MongoDB
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a simple product schema for our script
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  brand: String,
  image: String,
  store: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId
});

const Product = mongoose.model('Product', productSchema);

// Sample products data
const sampleProducts = [
  {
    name: "Organic Coffee Beans",
    description: "Premium organic coffee beans sourced from local farms",
    price: 12.99,
    category: "Food & Dining",
    image: "/mock-images/food-dining.svg"
  },
  {
    name: "Handmade Soap Set",
    description: "Artisan soap set with natural ingredients",
    price: 24.99,
    category: "Beauty & Personal Care",
    image: "/mock-images/beauty-personal-care.svg"
  },
  {
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring",
    price: 79.99,
    category: "Technology",
    image: "/mock-images/technology.svg"
  },
  {
    name: "Indoor Plant Collection",
    description: "Set of 3 indoor plants with care instructions",
    price: 34.99,
    category: "Home & Garden",
    image: "/mock-images/home-garden.svg"
  }
];

// Add sample products
const addSampleProducts = async () => {
  try {
    // Wait for the connection to be established
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, 'connection error:'));
    
    db.once('open', async () => {
      console.log('Connected to MongoDB');
      
      // Check if storeIds.json exists
      if (!fs.existsSync('./scripts/storeIds.json')) {
        console.log('storeIds.json not found. Please run addSampleStores.js first.');
        mongoose.connection.close();
        return;
      }
      
      // Read store IDs from file
      const storeIds = JSON.parse(fs.readFileSync('./scripts/storeIds.json', 'utf8'));
      
      if (storeIds.length === 0) {
        console.log('No store IDs found. Please run addSampleStores.js first.');
        mongoose.connection.close();
        return;
      }
      
      console.log(`Found ${storeIds.length} store IDs`);
      
      // Find the admin user to be the creator of products
      const User = mongoose.model('User', new mongoose.Schema({
        name: String,
        email: String,
        password: String,
        role: String,
      }));
      
      const adminUser = await User.findOne({ email: 'admin@glowkart.com' });
      
      if (!adminUser) {
        console.log('Admin user not found. Please run createAdminUser.js first.');
        mongoose.connection.close();
        return;
      }
      
      console.log(`Found admin user: ${adminUser.name} (${adminUser.email})`);
      
      // Clear existing products
      await Product.deleteMany({});
      console.log('Cleared existing products');
      
      // Add store and createdBy to each product
      const productsWithRefs = sampleProducts.map((product, index) => ({
        ...product,
        store: storeIds[index % storeIds.length], // Cycle through store IDs
        createdBy: adminUser._id
      }));
      
      // Add sample products
      const insertedProducts = await Product.insertMany(productsWithRefs);
      
      console.log(`Sample products added successfully! Inserted ${insertedProducts.length} products.`);
      mongoose.connection.close();
    });
  } catch (error) {
    console.error('Error adding sample products:', error);
    mongoose.connection.close();
  }
};

addSampleProducts();