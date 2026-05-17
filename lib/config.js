import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'test' ? '.env.test' : '.env';

dotenv.config({ path: path.join(ROOT, envFile), override: true });

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required env var ${name}. Expected in ${envFile}. ` +
      `Hint: copy .env.example → .env and .env.test.example → .env.test.`,
    );
  }
  return value;
}

const DEFAULT_PORT = 3000;

export const config = Object.freeze({
  port:        Number(process.env.PORT) || DEFAULT_PORT,
  databaseUrl: required('DATABASE_URL'),
  nodeEnv,
  envFile,
  paths: Object.freeze({
    root:   ROOT,
    views:  path.join(ROOT, 'views'),
    public: path.join(ROOT, 'public'),
  }),
});
