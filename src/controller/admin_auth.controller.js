import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminModel } from "../models/admin.model.js";

async function RegisterAdmin(req, res) {
  try {
    const { name, email, password,isActive } = req.body;
    if (name == "" || email == "" || password == "") {
      return res.status(404).json({
        message: "Please Fill All Fields",
      });
      // return res.resend("admin/login",{
      //     error:"Please Fill All Fileds",
      //     success:null
      // })
    }
    const isAdminExists = await AdminModel.findOne({ email });
    if (isAdminExists) {
      return res.render("admin/register", {
        success: "",
        error: "Admin Already Exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const Admin = await AdminModel.create({
      name,
      email,
      password: hashedPassword,
      isActive:"active"
    });
    const accessToken = jwt.sign(
      {
        _id: Admin._id,
        name: Admin.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "7d",
      },
    );
    Admin.accessToken = accessToken;
    await Admin.save();
    return res.status(201).json({
      message: "Admin Created",
    });
  } catch (err) {
    console.debug("Admin Register Error", err);
  }
}

async function loginAdmin(params) {
    
}

export { RegisterAdmin };
