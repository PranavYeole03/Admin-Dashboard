import User from "../models/user.model.js"
import bcrypt from "bcryptjs"


/* ================= ADMIN PROFILE ================= */

export const getAdminProfile = async (req,res)=>{
  try{

    const admin = await User.findById(req.userId)
      .select("-password")

    if(!admin || admin.role !== "admin"){
      return res.status(404).json({
        message:"Admin not found"
      })
    }

    res.status(200).json({
      name: admin.fullName,
      email: admin.email,
      role: admin.role
    })

  }catch(error){

    console.error("Profile fetch error:",error)

    res.status(500).json({
      message:"Profile fetch error"
    })

  }
}


/* ================= UPDATE PROFILE ================= */

export const updateAdminProfile = async (req,res)=>{
  try{

    const { fullName,email } = req.body

    const admin = await User.findByIdAndUpdate(
      req.userId,
      { fullName,email },
      { new:true }
    ).select("-password")

    if(!admin){
      return res.status(404).json({
        message:"Admin not found"
      })
    }

    res.status(200).json({
      message:"Profile updated",
      admin
    })

  }catch(error){

    console.error("Profile update error:",error)

    res.status(500).json({
      message:"Profile update error"
    })

  }
}


/* ================= CHANGE PASSWORD ================= */

export const changeAdminPassword = async (req,res)=>{
  try{

    const { oldPassword,newPassword } = req.body

    const admin = await User.findById(req.userId)

    if(!admin){
      return res.status(404).json({
        message:"Admin not found"
      })
    }

    const match = await bcrypt.compare(
      oldPassword,
      admin.password
    )

    if(!match){
      return res.status(400).json({
        message:"Current password incorrect"
      })
    }

    const hash = await bcrypt.hash(newPassword,10)

    admin.password = hash

    await admin.save()

    res.status(200).json({
      message:"Password updated successfully"
    })

  }catch(error){

    console.error("Password change error:",error)

    res.status(500).json({
      message:"Password change error"
    })

  }
}


/* ================= APP INFO ================= */

export const getAppInfo = async (req,res)=>{

  res.status(200).json({
    appName:"Fletto Food Delivery",
    version:"1.0.0",
    supportEmail:"fletto123fd@gmail.com",
    terms:"https://fletto.com/terms",
    privacy:"https://fletto.com/privacy"
  })

}