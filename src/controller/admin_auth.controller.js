import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AdminModel } from "../models/admin.model.js";

async function RegisterAdmin(req, res) {
  try {
    const { name, email, password, isActive } = req.body;
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
      isActive: "active"
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

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    if (email == "" || password == "") {
      return res.render("admin/login", {
        error: "Fill All Details",
        success: ""
      })
    }
    const User = await AdminModel.findOne({ email });
    if (!User) {
      return res.render("admin/login", {
        error: "User Not Found",
        success: ""
      })
    };

    const isPasswordMatched = await bcrypt.compare(password, User.password);
    if (!isPasswordMatched) {
      return res.render("admin/login", {
        error: "Invalid Credentials",
        success: ""
      })
    };

    const accessToken = jwt.sign({
      _id: User._id,
      email: User.email,
    },
      process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "7d"
    }
    )
    const refreshToken = jwt.sign({
      _id: User._id,
      email: User.email,
    },
      process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d"
    }
    )
    res.cookie("accessToken",accessToken,{expire: 400000 + Date.now()});
    res.cookie("refreshToken",refreshToken);

    User.accessToken=accessToken;
    await User.save();

    return res.render("admin/dashboard",{
      User
    });

  }
  catch (err) {
    console.error("Error", err);
  }
}
async function logout(req, res) {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        return res.redirect("/admin/login");

    } catch (error) {
        console.error("Logout Error:", error);
        return res.status(500).send("Something went wrong.");
    }
}

export { RegisterAdmin, loginAdmin,logout };
