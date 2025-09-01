import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import app from './app';

// Explicitly load .env from the backend folder so running scripts from other
// working directories still find the file.
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const res = dotenv.config({ path: envPath });
  if (res.error) {
    console.warn('[dotenv] Failed to load .env from', envPath, res.error);
  } else {
    console.log(`[dotenv] loaded ${Object.keys(res.parsed || {}).length} vars from ${envPath}`);
  }
} else {
  // Fallback to default behavior (searching process.cwd()). This keeps
  // compatibility with environments that set env vars externally.
  dotenv.config();
  console.warn(`[dotenv] .env not found at ${envPath}, attempted default load from cwd=${process.cwd()}`);
}

const PORT = process.env.PORT || 5000;

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('\u274c MONGO_URI is not set. Expected to find it in', envPath, 'or in the environment.');
  process.exit(1);
}

// Ensure JWT secret is present at startup. This prevents obscure runtime errors
// from the jsonwebtoken library when trying to sign tokens.
if (!process.env.JWT_SECRET) {
  console.error('\u274c JWT_SECRET is not set. Set JWT_SECRET in your environment or .env file.');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('\u2705 MongoDB Connected');
    app.listen(PORT, () => {
      console.log(`\ud83d\ude80 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('\u274c MongoDB connection error:', err);
  });
