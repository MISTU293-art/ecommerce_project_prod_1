import { AdminModel } from "../models/admin.model.js";
import jwt from "jsonwebtoken";

async function isLoggedIn(req, res, next) {
    try {
        // Get token from cookies
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.redirect("/admin/login");
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        // Find admin using decoded ID
        const user = await AdminModel.findById(decoded._id)
            .select("-password -accessToken -refreshToken");

        if (!user) {
            return res.redirect("/admin/login");
        }

        // Attach authenticated user
        req.user = user;

        // Continue
        return next();

    } catch (error) {
        console.error("Authentication Error:", error.message);
        return res.redirect("/admin/login");
    }
}

export { isLoggedIn };