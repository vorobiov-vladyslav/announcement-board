import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp, loadHtml } from './helpers.js';

const app = buildApp();

describe('GET /announcements (form)', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/announcements');
    expect(res.status).toBe(200);
  });

  it('renders form with all 5 fields', async () => {
    const res = await request(app).get('/announcements');
    const $ = loadHtml(res.text);

    expect($('form[action="/announcements"][method="POST"]').length).toBe(1);
    expect($('input[name="category"]').length).toBe(4);
    expect($('input[name="title"]').length).toBe(1);
    expect($('textarea[name="description"]').length).toBe(1);
    expect($('input[name="price"]').length).toBe(1);
    expect($('input[name="contactInfo"]').length).toBe(1);
  });

  it('title input has required and minlength=5', async () => {
    const res = await request(app).get('/announcements');
    const $ = loadHtml(res.text);
    const title = $('input[name="title"]');
    expect(title.attr('required')).toBeDefined();
    expect(title.attr('minlength')).toBe('5');
  });

  it('price input is type=number with min=0 and step=0.01', async () => {
    const res = await request(app).get('/announcements');
    const $ = loadHtml(res.text);
    const price = $('input[name="price"]');
    expect(price.attr('type')).toBe('number');
    expect(price.attr('min')).toBe('0');
    expect(price.attr('step')).toBe('0.01');
  });

  it('description has minlength=10', async () => {
    const res = await request(app).get('/announcements');
    const $ = loadHtml(res.text);
    expect($('textarea[name="description"]').attr('minlength')).toBe('10');
  });

  it('shows all 4 category radio buttons with correct values', async () => {
    const res = await request(app).get('/announcements');
    const $ = loadHtml(res.text);
    const values = $('input[name="category"]').map((_, el) => $(el).attr('value')).get();
    expect(values).toEqual(['sale', 'service', 'job', 'other']);
  });
});
