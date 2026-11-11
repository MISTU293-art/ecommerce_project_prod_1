import { AdminModel } from "../models/admin.model.js";

async function allAdmins(req, res) {
    try {

        const admins = await AdminModel.find()
            .select("-password -accessToken -refreshToken")
            .sort({ createdAt: -1 })
            .lean();

        return res.render("admin/admin", {
            User: req.user,
            admins,
            error: ""
        });

    } catch (err) {

        console.error("Admin Fetch Error:", err);

        return res.status(500).render("admin/dashboard", {
            User: req.user,
            error: "Something went wrong while fetching administrators.",
            admins: []
        });

    }
}

export { allAdmins };