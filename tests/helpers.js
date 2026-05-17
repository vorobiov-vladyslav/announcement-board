import { load } from 'cheerio';
import { prisma } from './setup.js';
import { createApp } from '../app.js';

export function buildApp() {
  return createApp(prisma);
}

let nextCounter = 0;

export async function createAnnouncement(overrides = {}) {
  nextCounter += 1;
  const i = nextCounter;
  return prisma.announcement.create({
    data: {
      title: `Тестове оголошення ${i}`,
      description: `Опис оголошення ${i} з достатньою кількістю символів`,
      category: 'sale',
      price: 100 + i,
      contactInfo: `email${i}@example.com`,
      ...overrides,
    },
  });
}

export function loadHtml(text) {
  return load(text);
}

export function validBody(overrides = {}) {
  return {
    title: 'Валідна назва',
    description: 'Опис тестового оголошення з достатньою довжиною',
    category: 'sale',
    price: '150.50',
    contactInfo: 'contact@example.com',
    ...overrides,
  };
}
