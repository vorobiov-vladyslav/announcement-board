import { VALIDATION } from './constants.js';

export const VALIDATION_ERRORS = {
  TITLE:       `Назва має бути не менше ${VALIDATION.MIN_TITLE_LENGTH} символів`,
  DESCRIPTION: `Опис має бути не менше ${VALIDATION.MIN_DESCRIPTION_LENGTH} символів`,
  CONTACT:     `Контактна інформація має бути не менше ${VALIDATION.MIN_CONTACT_LENGTH} символів`,
  CATEGORY:    'Оберіть категорію',
  PRICE:       'Ціна має бути додатним числом',
};
