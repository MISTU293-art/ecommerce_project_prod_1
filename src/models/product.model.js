import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    // ---------- Basic details ----------
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["electronic", "household", "kitchen", "kids"],
      required: true,
      index: true,
    },
    short_description: {
      type: String,
      maxlength: 160,
    },
    description: {
      type: String,
    },
    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    // ---------- Price & stock ----------
    mrp: {
      type: Number,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0, // percent, calculated on save
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      enum: ["piece", "kg", "litre", "pack"],
      default: "piece",
    },

    // ---------- Images ----------
    main_image: {
      type: String,
      required: true, // ImageKit URL
    },
    main_image_id: {
      type: String, // ImageKit fileId, needed to delete the image later
    },

    // ---------- Extra details ----------
    seller: {
      name: {
        type: String,
        trim: true,
      },
      gst_no: {
        type: String,
        uppercase: true,
        trim: true, // optional
      },
    },
    weight: {
      type: Number,
      min: 0, // kg
    },
    warranty_months: {
      type: Number,
      min: 0,
      default: 0,
    },

    // ---------- Refund ----------
    refund: {
      exists: {
        type: Boolean,
        default: false,
      },
      days: {
        type: Number,
        min: 1,
        default: 7,
      },
      policy: {
        type: String,
      },
    },

    // ---------- Listing status ----------
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
      index: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },

    // ---------- Optional: who created it ----------
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
  },
  {
    timestamps: true,
  },
);

// Auto-calculate discount + slug
ProductSchema.pre("save", async function () {
  if (this.mrp > 0 && this.price <= this.mrp) {
    this.discount = Math.round((1 - this.price / this.mrp) * 100);
  }
  if (!this.slug) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Date.now().toString(36);
  }
});

// Text search on name, brand, tags
ProductSchema.index({ name: "text", brand: "text", tags: "text" });

const ProductModel = mongoose.model("products", ProductSchema);
export { ProductModel };