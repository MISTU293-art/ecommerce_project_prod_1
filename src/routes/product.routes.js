import express from "express";
import { upload } from "../utils/multer_upload.js";
import {  addProduct ,allproducts} from "../controller/product.controller.js";

const router = express.Router();
// GET /product/add
router.get('/add',(req,res)=>{
    res.render("admin/product-add",{
        error:"",
        success:""
    })
});
// POST /product/add
router.post("/add", upload.single("main_image"), addProduct);
// GET /product/products
router.get('/products',allproducts);

export default router;