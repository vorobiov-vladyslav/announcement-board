import { VALID_CATEGORIES, VALIDATION } from '../lib/constants.js';
import { VALIDATION_ERRORS } from '../lib/messages.js';

export function validateAnnouncement(body) {
  const errors = {};
  const { title, description, category, price, contactInfo } = body;

  if (!title || title.trim().length < VALIDATION.MIN_TITLE_LENGTH) {
    errors.title = VALIDATION_ERRORS.TITLE;
  }

  if (!description || description.trim().length < VALIDATION.MIN_DESCRIPTION_LENGTH) {
    errors.description = VALIDATION_ERRORS.DESCRIPTION;
  }

  if (!contactInfo || contactInfo.trim().length < VALIDATION.MIN_CONTACT_LENGTH) {
    errors.contactInfo = VALIDATION_ERRORS.CONTACT;
  }

  if (!VALID_CATEGORIES.includes(category)) {
    errors.category = VALIDATION_ERRORS.CATEGORY;
  }

  if (!price || isNaN(price) || Number(price) <= 0) {
    errors.price = VALIDATION_ERRORS.PRICE;
  }

  return errors;
}
