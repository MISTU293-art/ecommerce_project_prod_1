import express from 'express';
import { Router } from 'express';
const router = express.Router();
import { RegisterAdmin } from '../controller/admin_auth.controller.js';
router.get('/login',(req,res)=>{
    res.render("admin/login",{
        success:"",
        error:""
    })
})
// Register post
router.post("/register",RegisterAdmin)
export default router