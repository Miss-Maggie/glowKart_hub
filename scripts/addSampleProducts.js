// Simple script to add sample products to the database
const mongoose = require('mongoose');

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
    image: "/mock-images/food-dining.svg",
    store: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0"),
    createdBy: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0")
  },
  {
    name: "Handmade Soap Set",
    description: "Artisan soap set with natural ingredients",
    price: 24.99,
    category: "Beauty & Personal Care",
    image: "/mock-images/beauty-personal-care.svg",
    store: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0"),
    createdBy: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0")
  },
  {
    name: "Smart Fitness Tracker",
    description: "Advanced fitness tracker with heart rate monitoring",
    price: 79.99,
    category: "Technology",
    image: "/mock-images/technology.svg",
    store: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0"),
    createdBy: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0")
  },
  {
    name: "Indoor Plant Collection",
    description: "Set of 3 indoor plants with care instructions",
    price: 34.99,
    category: "Home & Garden",
    image: "/mock-images/home-garden.svg",
    store: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0"),
    createdBy: new mongoose.Types.ObjectId("60a0a0a0a0a0a0a0a0a0a0a0")
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
      
      // Clear existing products
      await Product.deleteMany({});
      console.log('Cleared existing products');
      
      // Add sample products
      const insertedProducts = await Product.insertMany(sampleProducts);
      
      console.log(`Sample products added successfully! Inserted ${insertedProducts.length} products.`);
      mongoose.connection.close();
    });
  } catch (error) {
    console.error('Error adding sample products:', error);
    mongoose.connection.close();
  }
};

addSampleProducts();