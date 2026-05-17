import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp, loadHtml } from './helpers.js';
import { createApp } from '../app.js';

const app = buildApp();

describe('error handlers', () => {
  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/this-does-not-exist');
    expect(res.status).toBe(404);
    const $ = loadHtml(res.text);
    expect($('[data-testid="error-404"]').length).toBe(1);
  });

  it('returns 404 for unknown POST', async () => {
    const res = await request(app).post('/random/whatever');
    expect(res.status).toBe(404);
  });

  it('returns 500 when prisma throws on the list route', async () => {
    const brokenPrisma = {
      announcement: {
        findMany: async () => {
          throw new Error('db is down');
        },
        count: async () => {
          throw new Error('db is down');
        },
      },
    };
    const brokenApp = createApp(brokenPrisma);

    const res = await request(brokenApp).get('/');
    expect(res.status).toBe(500);
    const $ = loadHtml(res.text);
    expect($('[data-testid="error-500"]').length).toBe(1);
  });
});
