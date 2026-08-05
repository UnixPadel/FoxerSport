import Iyzipay from 'iyzipay';
import dotenv from 'dotenv';

dotenv.config();

// ── Validate required environment variables ──────────────────────────
const REQUIRED_ENV = ['IYZICO_API_KEY', 'IYZICO_SECRET_KEY', 'IYZICO_URI'];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`[Iyzico] Missing required environment variable: ${key}`);
    process.exit(1);
  }
}

// ── Detect sandbox mode ──────────────────────────────────────────────
const isSandbox = process.env.IYZICO_URI.includes('sandbox');

if (isSandbox) {
  console.log('[Iyzico] ⚠️  Running in SANDBOX (test) mode');
} else {
  console.log('[Iyzico] ✅ Running in PRODUCTION mode');
}

// ── Create Iyzipay instance ──────────────────────────────────────────
const iyzipay = new Iyzipay({
  apiKey:    process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri:       process.env.IYZICO_URI,
});

export { isSandbox };
export default iyzipay;
