import express from 'express';
import { allAdmins } from '../controller/admin_management.controller.js';
import { isLoggedIn } from '../middleware/isLoggedIn.middleware.js';
const router = express.Router();

// GET /admin/management/admins
router.get('/admins',isLoggedIn, allAdmins);

export default router;