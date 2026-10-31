import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDb from './config/db.config.js';
// Configure dotenv
dotenv.config({
    path: ".env"
});

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(cors({ origin: "*" }));

/** EJS Setup */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public folder
app.use('/public', express.static(path.join(__dirname, 'views', 'public')));
app.use(express.static(path.join(__dirname, 'public')));
// db connection
connectDb()
/** Home Page */
const productData = [
  {
    id: 1,
    name: 'Wireless Noise-Canceling Headphones',
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and plush memory foam ear cushions.',
    price: 149.99,
    currency: 'Rs',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80',
    category: 'Electronics',
    inStock: true,
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Ergonomic Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with customizable switches, hot-swappable PCB, and durable aluminum frame.',
    price: 89.5,
    currency: 'Rs',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80',
    category: 'Accessories',
    inStock: true,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Minimalist Stainless Steel Water Bottle',
    description: 'Double-walled vacuum insulated bottle keeps drinks cold for 24 hours or hot for 12 hours. 750ml capacity.',
    price: 24.99,
    currency: 'Rs',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    category: 'Lifestyle',
    inStock: false,
    rating: 4.2,
  },
];
app.get('/', (req, res) => {
    res.render('index',{products:productData});
});
/** Admin Auth Router */
import adminAuthRoutes from './routes/admin_auth.routes.js';
app.use('/admin',adminAuthRoutes)
export default app;