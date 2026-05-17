import { validateAnnouncement } from '../validators/announcement.js';
import {
  PER_PAGE,
  HTTP_STATUS,
  PRISMA_ERROR,
  VIEWS,
  SORT,
  APP_KEYS,
} from '../lib/constants.js';
import { announcementUrl } from '../lib/paths.js';

export async function list(req, res, next) {
  try {
    const prisma = req.app.get(APP_KEYS.PRISMA);
    const { search = '', sort = SORT.NEWEST, page = '1' } = req.query;
    const pageNum = Math.max(1, Number(page) || 1);

    const where = {};
    if (search) {
      where.title = { contains: search };
    }
    const orderBy = { createdAt: sort === SORT.OLDEST ? SORT.ASC : SORT.DESC };

    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where,
        orderBy,
        skip: (pageNum - 1) * PER_PAGE,
        take: PER_PAGE,
      }),
      prisma.announcement.count({ where }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

    res.render(VIEWS.INDEX, {
      announcements,
      search,
      sort,
      currentPage: pageNum,
      totalPages,
      total,
    });
  } catch (err) {
    next(err);
  }
}

export function newForm(req, res) {
  res.render(VIEWS.NEW, { errors: {}, data: null });
}

export async function create(req, res, next) {
  try {
    const prisma = req.app.get(APP_KEYS.PRISMA);
    const errors = validateAnnouncement(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).render(VIEWS.NEW, { errors, data: req.body });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title: req.body.title.trim(),
        description: req.body.description.trim(),
        category: req.body.category,
        price: Number(req.body.price),
        contactInfo: req.body.contactInfo.trim(),
      },
    });

    res.redirect(announcementUrl(announcement.id));
  } catch (err) {
    next(err);
  }
}

export async function show(req, res, next) {
  try {
    const prisma = req.app.get(APP_KEYS.PRISMA);
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).render(VIEWS.NOT_FOUND);
    }

    const announcement = await prisma.announcement.findUnique({ where: { id } });
    if (!announcement) {
      return res.status(HTTP_STATUS.NOT_FOUND).render(VIEWS.NOT_FOUND);
    }

    res.render(VIEWS.SHOW, { announcement });
  } catch (err) {
    next(err);
  }
}

export async function destroy(req, res, next) {
  try {
    const prisma = req.app.get(APP_KEYS.PRISMA);
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(HTTP_STATUS.NOT_FOUND).end();
    }

    try {
      await prisma.announcement.delete({ where: { id } });
    } catch (err) {
      if (err.code === PRISMA_ERROR.RECORD_NOT_FOUND) {
        return res.status(HTTP_STATUS.NOT_FOUND).end();
      }
      throw err;
    }

    res.status(HTTP_STATUS.NO_CONTENT).end();
  } catch (err) {
    next(err);
  }
}
