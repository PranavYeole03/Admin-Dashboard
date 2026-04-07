import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"
import { sendOtpMail } from "../utils/mail.js"


/* ================= SIGN UP ================= */

export const signUp = async (req, res) => {
  try {

    const { fullName, email, password, mobile } = req.body

    if (!fullName || !email || !password || !mobile) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      })
    }

    if (mobile.length < 10) {
      return res.status(400).json({
        message: "Mobile number must be 10 digits"
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      email,
      mobile,
      password: hashPassword,
      role: "user"   // important security fix
    })

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {

    console.error("Signup error:", error)

    res.status(500).json({
      message: "Signup error"
    })

  }
}



/* ================= SIGN IN ================= */

export const signIn = async (req, res) => {
  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User does not exist"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect password"
      })
    }

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      message: "Signin successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {

    console.error("Signin error:", error)

    res.status(500).json({
      message: "Signin error"
    })

  }
}



/* ================= SIGN OUT ================= */

export const signOut = async (req, res) => {
  try {

    res.clearCookie("token")

    res.status(200).json({
      message: "Logout successful"
    })

  } catch (error) {

    res.status(500).json({
      message: "Sign out error"
    })

  }
}



/* ================= SEND OTP ================= */

export const sendOtp = async (req, res) => {
  try {

    const { email } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User does not exist"
      })
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString()

    user.resetOtp = otp
    user.otpExpires = Date.now() + 5 * 60 * 1000
    user.isOtpVerified = false

    await user.save()

    await sendOtpMail(email, otp)

    res.status(200).json({
      message: "OTP sent successfully"
    })

  } catch (error) {

    console.error("Send OTP error:", error)

    res.status(500).json({
      message: "Send OTP error"
    })

  }
}



/* ================= VERIFY OTP ================= */

export const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      })
    }

    if (user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({
        message: "Invalid or expired OTP"
      })
    }

    user.isOtpVerified = true
    user.resetOtp = undefined
    user.otpExpires = undefined

    await user.save()

    res.status(200).json({
      message: "OTP verified successfully"
    })

  } catch (error) {

    console.error("Verify OTP error:", error)

    res.status(500).json({
      message: "Verify OTP error"
    })

  }
}



/* ================= RESET PASSWORD ================= */

export const resetPassword = async (req, res) => {
  try {

    const { email, newpassword, confirmpassword } = req.body

    if (newpassword !== confirmpassword) {
      return res.status(400).json({
        message: "Passwords do not match"
      })
    }

    const user = await User.findOne({ email })

    if (!user || !user.isOtpVerified) {
      return res.status(400).json({
        message: "OTP verification required"
      })
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10)

    user.password = hashedPassword
    user.isOtpVerified = false

    await user.save()

    res.status(200).json({
      message: "Password reset successfully"
    })

  } catch (error) {

    console.error("Reset password error:", error)

    res.status(500).json({
      message: "Reset password error"
    })

  }
}


export const googleAuth = async (req, res) => {
  try {

    const { fullName, email, mobile } = req.body

    let user = await User.findOne({ email })

    if (!user) {

      user = await User.create({
        fullName,
        email,
        mobile,
        role: "user"
      })

    }

    const token = await genToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "Strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {

    console.error("Google auth error:", error)

    res.status(500).json({
      message: "Google auth error"
    })

  }
}
