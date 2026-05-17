import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp, validBody, loadHtml } from './helpers.js';
import { prisma } from './setup.js';

const app = buildApp();

describe('POST /announcements', () => {
  it('creates an announcement with valid data and redirects', async () => {
    const res = await request(app)
      .post('/announcements')
      .type('form')
      .send(validBody());

    expect(res.status).toBe(302);
    expect(res.headers.location).toMatch(/^\/announcements\/\d+$/);

    const count = await prisma.announcement.count();
    expect(count).toBe(1);
  });

  it('stores fields correctly', async () => {
    await request(app)
      .post('/announcements')
      .type('form')
      .send(validBody({
        title: 'My Title',
        description: 'My description that is long enough',
        category: 'job',
        price: '250.5',
        contactInfo: 'me@example.com',
      }));

    const ann = await prisma.announcement.findFirst();
    expect(ann.title).toBe('My Title');
    expect(ann.description).toBe('My description that is long enough');
    expect(ann.category).toBe('job');
    expect(ann.price).toBe(250.5);
    expect(ann.contactInfo).toBe('me@example.com');
  });

  describe('validation', () => {
    async function postWith(overrides) {
      return request(app).post('/announcements').type('form').send(validBody(overrides));
    }

    it('rejects short title', async () => {
      const res = await postWith({ title: 'abc' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-title"]').text()).toContain('5');
      expect(await prisma.announcement.count()).toBe(0);
    });

    it('rejects missing title', async () => {
      const res = await postWith({ title: '' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-title"]').length).toBe(1);
    });

    it('rejects whitespace-only title', async () => {
      const res = await postWith({ title: '       ' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-title"]').length).toBe(1);
    });

    it('rejects short description (< 10 chars)', async () => {
      const res = await postWith({ description: 'short' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-description"]').text()).toContain('10');
    });

    it('rejects short contactInfo (< 5 chars)', async () => {
      const res = await postWith({ contactInfo: 'a@b' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-contactInfo"]').length).toBe(1);
    });

    it('rejects invalid category', async () => {
      const res = await postWith({ category: 'hacker' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-category"]').length).toBe(1);
    });

    it('rejects missing price', async () => {
      const res = await postWith({ price: '' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-price"]').length).toBe(1);
    });

    it('rejects non-numeric price', async () => {
      const res = await postWith({ price: 'abc' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-price"]').length).toBe(1);
    });

    it('rejects zero price', async () => {
      const res = await postWith({ price: '0' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-price"]').length).toBe(1);
    });

    it('rejects negative price', async () => {
      const res = await postWith({ price: '-5' });
      expect(res.status).toBe(400);
      const $ = loadHtml(res.text);
      expect($('[data-testid="error-price"]').length).toBe(1);
    });

    it('accepts decimal price', async () => {
      const res = await postWith({ price: '10.50' });
      expect(res.status).toBe(302);
    });
  });

  describe('preserves data on validation errors', () => {
    it('keeps text values in inputs', async () => {
      const res = await request(app)
        .post('/announcements')
        .type('form')
        .send(validBody({ title: 'abc', description: 'My valid description text' }));

      const $ = loadHtml(res.text);
      expect($('textarea[name="description"]').text()).toBe('My valid description text');
    });

    it('keeps radio selection', async () => {
      const res = await request(app)
        .post('/announcements')
        .type('form')
        .send(validBody({ title: 'abc', category: 'job' }));

      const $ = loadHtml(res.text);
      const jobRadio = $('input[name="category"][value="job"]');
      expect(jobRadio.attr('checked')).toBeDefined();
    });
  });

  it('trims text fields before saving', async () => {
    await request(app)
      .post('/announcements')
      .type('form')
      .send(validBody({
        title: '  Hello World  ',
        description: '  A long enough description here  ',
        contactInfo: '  me@example.com  ',
      }));

    const ann = await prisma.announcement.findFirst();
    expect(ann.title).toBe('Hello World');
    expect(ann.description).toBe('A long enough description here');
    expect(ann.contactInfo).toBe('me@example.com');
  });
});
