import express from "express";
import { upload } from "../utils/multer_upload.js";
import {  addProduct ,allproducts,productProfile} from "../controller/product.controller.js";

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
// GET /product/details/:_id
router.get('/details/:_id',productProfile);
export default router;