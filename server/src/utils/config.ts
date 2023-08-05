import 'dotenv/config';
import { Secret } from 'jsonwebtoken';

const PORT = Number(process.env.PORT) ?? 4000;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;
const SECRET: Secret = process.env.SECRET ?? 'privateKeyForToken';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;
const EMAIL = process.env.EMAIL;
const WEB_APP_URL = process.env.WEB_APP_URL;

export default {
  PORT,
  MONGODB_URI,
  SECRET,
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  REDIRECT_URI,
  EMAIL,
  WEB_APP_URL,
};