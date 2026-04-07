import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

/* REGISTER ADMIN */
export const registerAdmin = async (req,res)=>{
  try{

    const { fullName,email,password } = req.body

    if(!fullName || !email || !password){
      return res.status(400).json({
        message:"All fields are required"
      })
    }

    if(password.length < 6){
      return res.status(400).json({
        message:"Password must be at least 6 characters"
      })
    }

    const existing = await User.findOne({ email })

    if(existing){
      return res.status(400).json({
        message:"Admin already exists"
      })
    }

    const hashPassword = await bcrypt.hash(password,10)

    const admin = await User.create({
      fullName,
      email,
      password: hashPassword,
      mobile: "0000000000",   // temporary required field
      role: "admin"
    })

    return res.status(201).json({
      message:"Admin registered successfully",
      admin:{
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email
      }
    })

  }catch(error){

    console.error("Register Admin Error:",error)

    return res.status(500).json({
      message:"Register error"
    })

  }
}


/* LOGIN ADMIN */
export const loginAdmin = async (req,res)=>{
  try{

    const { email,password } = req.body

    if(!email || !password){
      return res.status(400).json({
        message:"Email and password are required"
      })
    }

    const admin = await User.findOne({
      email,
      role:"admin"
    })

    if(!admin){
      return res.status(400).json({
        message:"Admin not found"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    )

    if(!isMatch){
      return res.status(400).json({
        message:"Incorrect password"
      })
    }

    const token = jwt.sign(
      { userId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn:"7d" }
    )

    res.cookie("token",token,{
      httpOnly:true,
      sameSite:"strict",
      secure:false,
      maxAge: 7*24*60*60*1000
    })

    return res.status(200).json({
      message:"Login successful",
      admin:{
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email
      }
    })

  }catch(error){

    console.error("Login Admin Error:",error)

    return res.status(500).json({
      message:"Login error"
    })

  }
}


/* LOGOUT ADMIN */
export const logoutAdmin = async (req,res)=>{
  try{

    res.clearCookie("token",{
      httpOnly:true,
      sameSite:"strict",
      secure:false,
      path:"/"
    })

    return res.status(200).json({
      message:"Logout successful"
    })

  }catch(error){

    console.error("Logout Admin Error:",error)

    return res.status(500).json({
      message:"Logout error"
    })

  }
}