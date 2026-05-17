import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { buildApp, createAnnouncement } from './helpers.js';
import { prisma } from './setup.js';

const app = buildApp();

describe('DELETE /announcements/:id', () => {
  it('deletes an existing announcement', async () => {
    const ann = await createAnnouncement();

    const res = await request(app).delete(`/announcements/${ann.id}`);
    expect(res.status).toBe(204);
    expect(res.text).toBe('');

    const count = await prisma.announcement.count();
    expect(count).toBe(0);
  });

  it('returns 404 for missing id', async () => {
    const res = await request(app).delete('/announcements/99999');
    expect(res.status).toBe(404);
  });

  it('returns 404 for non-numeric id', async () => {
    const res = await request(app).delete('/announcements/abc');
    expect(res.status).toBe(404);
  });

  it('does not affect other announcements', async () => {
    const a = await createAnnouncement({ title: 'A' });
    const b = await createAnnouncement({ title: 'B' });

    await request(app).delete(`/announcements/${a.id}`);

    const remaining = await prisma.announcement.findMany();
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(b.id);
  });
});
