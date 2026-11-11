import express from 'express';
import { Router } from 'express';
const router = express.Router();
import { isLoggedIn } from '../middleware/isLoggedIn.middleware.js';
import { RegisterAdmin, loginAdmin,logout } from '../controller/admin_auth.controller.js';
// GET /admin/login
router.get('/login', (req, res) => {
    res.render("admin/login", {
        success: "",
        error: ""
    })
})
// POST /admin/login
router.post("/login", loginAdmin);
// Register post
router.post("/register",isLoggedIn, RegisterAdmin);
// GET /admin/dashboard
router.get('/dashboard', isLoggedIn,(req, res) => {
    res.render("admin/dashboard", {
        error: "",
        success: ""
    })
});
// GET /admin/logout
router.get('/logout',logout)
export default router