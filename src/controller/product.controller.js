import { ProductModel } from "../models/product.model.js";
import { imagekit } from "../utils/imagekit.js";
import { toFile } from "@imagekit/nodejs";

async function addProduct(req, res) {
    try {
        const {
            name,
            brand,
            sku,
            category,
            short_description,
            description,
            tags,
            mrp,
            price,
            stock,
            unit,
            seller_name,
            gst_no,
            weight,
            warranty_months,
            refund_exists,
            refund_days,
            refund_policy,
            status,
            is_featured,
        } = req.body;
        // discount is NOT taken from the form, the model calculates it on save
        // main_image is NOT in req.body, it comes from req.file (multer)

        // ---------- validation ----------
        if (!name || !price || !category) {
            return res.render("admin/product-add", {
                error: "Name, price and category are required",
                success: "",
            });
        }

        if (!req.file) {
            return res.render("admin/product-add", {
                error: "Main image is required",
                success: "",
            });
        }

        if (mrp && Number(price) > Number(mrp)) {
            return res.render("admin/product-add", {
                error: "Selling price cannot be more than MRP",
                success: "",
            });
        }

        // ---------- upload image to ImageKit ----------
        const uploaded = await imagekit.files.upload({
            file: await toFile(req.file.buffer, req.file.originalname),
            fileName: `${Date.now()}-${req.file.originalname}`,
            folder: "/products",
        });
        // ---------- save product ----------
        await ProductModel.create({
            name,
            brand,
            sku: sku || undefined, // empty SKU must be undefined (unique + sparse)
            category,
            short_description,
            description,
            tags: tags
                ? tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [],
            mrp: mrp || undefined,
            price,
            stock: stock || 0,
            unit,
            main_image: uploaded.url, // ImageKit URL
            main_image_id: uploaded.fileId, // keep this so you can delete the image later
            seller: {
                name: seller_name,
                gst_no,
            },
            weight: weight || undefined,
            warranty_months: warranty_months || 0,
            refund: {
                exists: refund_exists === "yes",
                days: refund_exists === "yes" ? refund_days : undefined,
                policy: refund_policy,
            },
            status,
            is_featured: is_featured === "on",
            created_by: req.admin?._id, // if you set req.admin in your auth middleware
        });

        return res.render("admin/product-add", {
            error: "",
            success: "Product added successfully",
        });
    } catch (err) {
        console.error(err);

        // duplicate SKU
        if (err.code === 11000) {
            return res.render("admin/product-add", {
                error: "A product with this SKU already exists",
                success: "",
            });
        }

        // mongoose validation error
        if (err.name === "ValidationError") {
            return res.render("admin/product-add", {
                error: Object.values(err.errors)[0].message,
                success: "",
            });
        }

        return res.render("admin/product-add", {
            error: "Internal Server Error",
            success: "",
        });
    }
}

async function allproducts(req,res) {
    try{
        const products = await ProductModel.find();
        
        return res.status(200).json({
            products
        })
    }
    catch(err){
        console.log("Error:",err);

    }
}


export { addProduct,allproducts };
