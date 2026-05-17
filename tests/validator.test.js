import { describe, it, expect } from 'vitest';
import { validateAnnouncement } from '../validators/announcement.js';

describe('validateAnnouncement', () => {
  const valid = {
    title: 'Valid title',
    description: 'Description with enough length',
    category: 'sale',
    price: '100',
    contactInfo: 'me@example.com',
  };

  it('returns no errors for valid input', () => {
    expect(validateAnnouncement(valid)).toEqual({});
  });

  it('flags short title', () => {
    expect(validateAnnouncement({ ...valid, title: 'abc' }).title).toBeTruthy();
  });

  it('flags whitespace-only title', () => {
    expect(validateAnnouncement({ ...valid, title: '       ' }).title).toBeTruthy();
  });

  it('flags short description', () => {
    expect(validateAnnouncement({ ...valid, description: 'short' }).description).toBeTruthy();
  });

  it('flags invalid category', () => {
    expect(validateAnnouncement({ ...valid, category: 'xxx' }).category).toBeTruthy();
  });

  it('accepts all 4 valid categories', () => {
    for (const c of ['sale', 'service', 'job', 'other']) {
      expect(validateAnnouncement({ ...valid, category: c }).category).toBeUndefined();
    }
  });

  it('flags non-numeric price', () => {
    expect(validateAnnouncement({ ...valid, price: 'abc' }).price).toBeTruthy();
  });

  it('flags zero price', () => {
    expect(validateAnnouncement({ ...valid, price: '0' }).price).toBeTruthy();
  });

  it('flags negative price', () => {
    expect(validateAnnouncement({ ...valid, price: '-5' }).price).toBeTruthy();
  });

  it('flags short contactInfo', () => {
    expect(validateAnnouncement({ ...valid, contactInfo: 'a@b' }).contactInfo).toBeTruthy();
  });
});
