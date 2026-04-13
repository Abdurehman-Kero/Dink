const express = require('express');

const {
  addReport,
  addEventReport,
  listOrganizerReports,
  getOrganizerReportById,
  decideOrganizerReport,
  listAdminReports,
  getAdminReportById,
  decideAdminReport,
  submitAppeal,
  listOrganizerAppeals,
  getOrganizerAppealById,
  decideOrganizerAppeal,
  listAdminAppeals,
  getAdminAppealById,
  decideAdminAppeal,
  getMyBans,
  getBanById
} = require('../controllers/moderationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/reports/review-user', addReport);
router.post('/reports/event', addEventReport);

router.get('/my-bans', getMyBans);
router.get('/bans/:banId', getBanById);
router.post('/appeals', submitAppeal);

router.get('/organizer/reports', authorize('organizer'), listOrganizerReports);
router.get('/organizer/reports/:id', authorize('organizer'), getOrganizerReportById);
router.post('/organizer/reports/:id/decision', authorize('organizer'), decideOrganizerReport);

router.get('/organizer/appeals', authorize('organizer'), listOrganizerAppeals);
router.get('/organizer/appeals/:id', authorize('organizer'), getOrganizerAppealById);
router.post('/organizer/appeals/:id/decision', authorize('organizer'), decideOrganizerAppeal);

router.get('/admin/reports', authorize('admin'), listAdminReports);
router.get('/admin/reports/:id', authorize('admin'), getAdminReportById);
router.post('/admin/reports/:id/decision', authorize('admin'), decideAdminReport);

router.get('/admin/appeals', authorize('admin'), listAdminAppeals);
router.get('/admin/appeals/:id', authorize('admin'), getAdminAppealById);
router.post('/admin/appeals/:id/decision', authorize('admin'), decideAdminAppeal);

module.exports = router;
