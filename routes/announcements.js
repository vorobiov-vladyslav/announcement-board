import express from 'express';
import * as ctrl from '../controllers/announcementsController.js';
import { PATH } from '../lib/paths.js';

const router = express.Router();

router.get(PATH.HOME,                  ctrl.list);
router.get(PATH.ANNOUNCEMENTS,         ctrl.newForm);
router.post(PATH.ANNOUNCEMENTS,        ctrl.create);
router.get(PATH.ANNOUNCEMENT_BY_ID,    ctrl.show);
router.delete(PATH.ANNOUNCEMENT_BY_ID, ctrl.destroy);

export default router;
