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

// Allow configuring allowed CORS origins via env: set CORS_ORIGINS="https://your-frontend.com,https://other.com"
const defaultOrigins = ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'];
const corsOrigins = process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.length > 0
  ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
  : defaultOrigins;

const corsOptions = {
  origin: (origin: any, cb: any) => {
    // origin may be undefined for same-origin or tools like curl/postman
    const requested = origin || 'no-origin';
    const allowed = corsOrigins.includes(requested) || corsOrigins.includes('*');
    console.log(`[CORS] incoming origin=${requested} allowed=${allowed}`);
    if (allowed) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Apply CORS with our dynamic origin checker
app.use((req, res, next) => {
  console.log('[CORS-MW] Request origin header:', req.headers.origin);
  return cors(corsOptions)(req, res, next);
});

// Diagnostics endpoint for live deployments. Use this to inspect request
// origin, headers, and see if CORS would allow the request. Do NOT expose
// sensitive environment variables here in production.
app.get('/api/diag', (req, res) => {
  const origin = req.headers.origin || 'none';
  const allowed = corsOrigins.includes(origin) || corsOrigins.includes('*');
  res.json({
    ok: true,
    origin,
    allowed,
    corsOrigins,
    headers: req.headers,
    url: req.originalUrl,
    method: req.method,
    uptime: process.uptime(),
  });
});
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
