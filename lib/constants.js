export const PER_PAGE = 10;

export const CATEGORY_LABELS = {
  sale:    { label: 'Продаж',  emoji: '🛒' },
  service: { label: 'Послуга', emoji: '🛠️' },
  job:     { label: 'Робота',  emoji: '💼' },
  other:   { label: 'Інше',    emoji: '📦' },
};

export const VALID_CATEGORIES = Object.keys(CATEGORY_LABELS);

export const HTTP_STATUS = {
  OK:            200,
  CREATED:       201,
  NO_CONTENT:    204,
  BAD_REQUEST:   400,
  NOT_FOUND:     404,
  SERVER_ERROR:  500,
};

export const PRISMA_ERROR = {
  RECORD_NOT_FOUND: 'P2025',
};

export const VIEWS = {
  INDEX:     'index',
  NEW:       'new',
  SHOW:      'show',
  NOT_FOUND: '404',
  ERROR:     'error',
};

export const SORT = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  ASC:    'asc',
  DESC:   'desc',
};

export const VALIDATION = {
  MIN_TITLE_LENGTH:       5,
  MIN_DESCRIPTION_LENGTH: 10,
  MIN_CONTACT_LENGTH:     5,
};

export const APP_KEYS = {
  PRISMA: 'prisma',
};

export const VIEW_ENGINE = 'ejs';
