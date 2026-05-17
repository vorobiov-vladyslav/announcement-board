import express from 'express';
import { PrismaClient } from '@prisma/client';
import {
  CATEGORY_LABELS,
  HTTP_STATUS,
  VIEWS,
  VIEW_ENGINE,
  APP_KEYS,
} from './lib/constants.js';
import { config } from './lib/config.js';
import announcementsRouter from './routes/announcements.js';

export function createApp(prisma = new PrismaClient()) {
  const app = express();

  app.set('view engine', VIEW_ENGINE);
  app.set('views', config.paths.views);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(config.paths.public));

  app.set(APP_KEYS.PRISMA, prisma);
  app.locals.categoryLabels = CATEGORY_LABELS;

  app.use(announcementsRouter);

  app.use((req, res) => {
    res.status(HTTP_STATUS.NOT_FOUND).render(VIEWS.NOT_FOUND);
  });

  app.use((err, req, res, _next) => {
    console.error(err);
    res.status(HTTP_STATUS.SERVER_ERROR).render(VIEWS.ERROR, { message: err.message });
  });

  return app;
}
