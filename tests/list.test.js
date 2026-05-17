import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp, createAnnouncement, loadHtml } from './helpers.js';

const app = buildApp();

describe('GET /', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  it('shows empty state when no announcements', async () => {
    const res = await request(app).get('/');
    const $ = loadHtml(res.text);
    expect($('[data-testid="empty-state"]').text()).toContain('Оголошень не знайдено');
  });

  it('renders cards when announcements exist', async () => {
    await createAnnouncement({ title: 'First' });
    await createAnnouncement({ title: 'Second' });
    await createAnnouncement({ title: 'Third' });

    const res = await request(app).get('/');
    const $ = loadHtml(res.text);
    expect($('[data-testid="card"]').length).toBe(3);
  });

  it('truncates description to 100 chars on cards', async () => {
    const longDescription = 'A'.repeat(200);
    await createAnnouncement({ title: 'Long', description: longDescription });

    const res = await request(app).get('/');
    const $ = loadHtml(res.text);
    const cardDesc = $('.card-description').first().text();
    expect(cardDesc.length).toBeLessThanOrEqual(100);
    expect(cardDesc).toBe('A'.repeat(100));
  });

  describe('search', () => {
    it('filters by title (case-insensitive ASCII)', async () => {
      await createAnnouncement({ title: 'Laptop ASUS' });
      await createAnnouncement({ title: 'Bicycle' });
      await createAnnouncement({ title: 'Old laptop' });

      const res = await request(app).get('/?search=laptop');
      const $ = loadHtml(res.text);
      const titles = $('.card-title').map((_, el) => $(el).text()).get();
      expect(titles).toHaveLength(2);
      expect(titles).toContain('Laptop ASUS');
      expect(titles).toContain('Old laptop');
    });

    it('shows empty state when nothing matches', async () => {
      await createAnnouncement({ title: 'Laptop' });
      const res = await request(app).get('/?search=zzznothing');
      const $ = loadHtml(res.text);
      expect($('[data-testid="empty-state"]').length).toBe(1);
    });
  });

  describe('sort', () => {
    it('sorts newest first by default', async () => {
      const a = await createAnnouncement({ title: 'A' });
      await new Promise((r) => setTimeout(r, 10));
      const b = await createAnnouncement({ title: 'B' });
      await new Promise((r) => setTimeout(r, 10));
      const c = await createAnnouncement({ title: 'C' });

      const res = await request(app).get('/');
      const $ = loadHtml(res.text);
      const titles = $('.card-title').map((_, el) => $(el).text()).get();
      expect(titles).toEqual([c.title, b.title, a.title]);
    });

    it('sorts oldest first when sort=oldest', async () => {
      const a = await createAnnouncement({ title: 'A' });
      await new Promise((r) => setTimeout(r, 10));
      const b = await createAnnouncement({ title: 'B' });
      await new Promise((r) => setTimeout(r, 10));
      const c = await createAnnouncement({ title: 'C' });

      const res = await request(app).get('/?sort=oldest');
      const $ = loadHtml(res.text);
      const titles = $('.card-title').map((_, el) => $(el).text()).get();
      expect(titles).toEqual([a.title, b.title, c.title]);
    });
  });

  describe('pagination', () => {
    it('shows 10 cards per page', async () => {
      for (let i = 0; i < 15; i++) {
        await createAnnouncement({ title: `Item ${i}` });
      }
      const res = await request(app).get('/');
      const $ = loadHtml(res.text);
      expect($('[data-testid="card"]').length).toBe(10);
    });

    it('shows 5 cards on page 2 when there are 15 total', async () => {
      for (let i = 0; i < 15; i++) {
        await createAnnouncement({ title: `Item ${i}` });
      }
      const res = await request(app).get('/?page=2');
      const $ = loadHtml(res.text);
      expect($('[data-testid="card"]').length).toBe(5);
    });

    it('disables Previous on page 1', async () => {
      for (let i = 0; i < 15; i++) {
        await createAnnouncement({ title: `Item ${i}` });
      }
      const res = await request(app).get('/?page=1');
      const $ = loadHtml(res.text);
      expect($('[data-testid="prev-page-disabled"]').length).toBe(1);
      expect($('[data-testid="next-page"]').length).toBe(1);
    });

    it('disables Next on last page', async () => {
      for (let i = 0; i < 15; i++) {
        await createAnnouncement({ title: `Item ${i}` });
      }
      const res = await request(app).get('/?page=2');
      const $ = loadHtml(res.text);
      expect($('[data-testid="prev-page"]').length).toBe(1);
      expect($('[data-testid="next-page-disabled"]').length).toBe(1);
    });

    it('preserves search and sort in pagination URLs', async () => {
      for (let i = 0; i < 15; i++) {
        await createAnnouncement({ title: `Item ${i}` });
      }
      const res = await request(app).get('/?search=Item&sort=oldest&page=1');
      const $ = loadHtml(res.text);
      const nextHref = $('[data-testid="next-page"]').attr('href');
      expect(nextHref).toContain('search=Item');
      expect(nextHref).toContain('sort=oldest');
      expect(nextHref).toContain('page=2');
    });

    it('hides pagination when there are fewer than 10 results', async () => {
      await createAnnouncement({ title: 'Only one' });
      const res = await request(app).get('/');
      const $ = loadHtml(res.text);
      expect($('[data-testid="pagination"]').length).toBe(0);
    });
  });
});
