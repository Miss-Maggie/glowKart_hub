import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import authRoutes from './routes/authRoutes';
import testRoute from './routes/testRoutes';
import storeRoute from './routes/storeRoute';
import productRoute from './routes/productRoute';
import orderRoute from './routes/orderRoute';
import userRoutes from './routes/userRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoute from './routes/uploadRoute';

const app = express();

const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static('uploads'));

// Example route
app.get('/', (_req, res) => {
  res.send('🌟 Welcome to GlowKart Hub API');
});

app.use('/api/auth', authRoutes);
app.use('/api/test', testRoute);
app.use('/api/stores', storeRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoute);

export default app;
