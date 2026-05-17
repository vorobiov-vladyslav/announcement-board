import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp, createAnnouncement, loadHtml } from './helpers.js';

const app = buildApp();

describe('GET /announcements/:id', () => {
  it('renders full announcement', async () => {
    const ann = await createAnnouncement({
      title: 'Test Title',
      description: 'A'.repeat(150),
      category: 'service',
      price: 999.99,
      contactInfo: 'tel:+380501234567',
    });

    const res = await request(app).get(`/announcements/${ann.id}`);
    expect(res.status).toBe(200);

    const $ = loadHtml(res.text);
    expect($('[data-testid="title"]').text()).toContain('Test Title');
    expect($('[data-testid="description"]').text()).toContain('A'.repeat(150));
    expect($('[data-testid="contact"]').text()).toContain('tel:+380501234567');
    expect($('[data-testid="price"]').text()).toContain('999.99');
  });

  it('shows full description without truncation', async () => {
    const longDescription = 'B'.repeat(500);
    const ann = await createAnnouncement({ description: longDescription });

    const res = await request(app).get(`/announcements/${ann.id}`);
    const $ = loadHtml(res.text);
    expect($('[data-testid="description"]').text()).toContain('B'.repeat(500));
  });

  it('returns 404 for missing id', async () => {
    const res = await request(app).get('/announcements/99999');
    expect(res.status).toBe(404);
    const $ = loadHtml(res.text);
    expect($('[data-testid="error-404"]').length).toBe(1);
  });

  it('returns 404 for non-numeric id', async () => {
    const res = await request(app).get('/announcements/abc');
    expect(res.status).toBe(404);
    const $ = loadHtml(res.text);
    expect($('[data-testid="error-404"]').length).toBe(1);
  });

  it('includes delete button with data-id', async () => {
    const ann = await createAnnouncement();
    const res = await request(app).get(`/announcements/${ann.id}`);
    const $ = loadHtml(res.text);
    const btn = $('#delete-btn');
    expect(btn.length).toBe(1);
    expect(btn.attr('data-id')).toBe(String(ann.id));
  });

  it('includes inline script with confirm and fetch DELETE', async () => {
    const ann = await createAnnouncement();
    const res = await request(app).get(`/announcements/${ann.id}`);
    expect(res.text).toContain('confirm(');
    expect(res.text).toContain("method: 'DELETE'");
  });
});
