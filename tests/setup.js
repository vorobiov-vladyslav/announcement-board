import { execSync } from 'child_process';
import { beforeAll, beforeEach, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { config } from '../lib/config.js';

if (!config.databaseUrl.includes('test')) {
  throw new Error(
    `Refusing to run tests against non-test database: ${config.databaseUrl}`,
  );
}

export const prisma = new PrismaClient();

beforeAll(() => {
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env },
  });
});

beforeEach(async () => {
  await prisma.announcement.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
