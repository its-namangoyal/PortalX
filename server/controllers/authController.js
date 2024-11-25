import Users from "../models/userModel.js";
import Student from "../models/studentsModel.js";
import Token from "../models/tokenModel.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";


// Add this new controller
export const verifyEmail = async (req, res) => {
  try {
    const user = await Users.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Invalid link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "Invalid link" });

    await Users.updateOne({ _id: user._id }, { verified: true });
    await Token.findByIdAndRemove(token._id);

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password, studentID, accountType } = req.body;

  // Validate fields
  if (!firstName) {
    next("First Name is required");
    return;
  }
  if (!lastName) {
    next("Last Name is required");
    return;
  }
  if (!email) {
    next("Email is required");
    return;
  }
  if (!password) {
    next("Password is required");
    return;
  }

  // Validate uwindsor.ca email
  if (!email.endsWith('@uwindsor.ca')) {
    next("Please use your @uwindsor.ca email address");
    return;
  }

  // If accountType is 'seeker', studentID is required
  if (accountType === "seeker" && !studentID) {
    next("Student ID is required");
    return;
  }

  try {
    // Check if the email already exists in the system
    const userExist = await Users.findOne({ email });
    if (userExist) {
      next("Email Address already exists");
      return;
    }

    // Check if the studentID already exists
    const studentExist = await Users.findOne({ studentID });
    if (studentExist) {
      next("Student ID already exists");
      return;
    }

    // Verify if the student is registered for the internship course
    const studentRegister = await Student.findOne({ studentID });
    if (!studentRegister) {
      next("Student not registered for the internship course");
      return;
    }

    try {
      // Create new user with verified status as false
      const user = await Users.create({
        firstName,
        lastName,
        email,
        password,
        studentID,
        accountType,
        semester: studentRegister.semester,
        verified: false
      });

      // Create verification token
      const verificationToken = await Token.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });

      // Create verification URL
      const verificationUrl = `${process.env.BASE_URL}verify/${user._id}/${verificationToken.token}`;
      
      // Create email content with UWindsor branding
      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f4f4f4; font-family: Arial, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #0033A0;">University of Windsor</h2>
                    <h3 style="color: #333333;">Internship Portal Verification</h3>
                </div>
                <p style="color: #666666; line-height: 1.6;">Dear ${firstName},</p>
                <p style="color: #666666; line-height: 1.6;">Thank you for registering with your UWindsor email. To complete your registration and access the Internship Portal, please verify your email address by clicking the button below:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="background-color: #0033A0; 
                              color: white; 
                              padding: 12px 30px; 
                              text-decoration: none; 
                              border-radius: 5px; 
                              display: inline-block;">Verify UWindsor Email</a>
                </div>
                <p style="color: #666666; line-height: 1.6;">Or copy and paste this link in your browser:</p>
                <p style="color: #666666; line-height: 1.6; word-break: break-all;">${verificationUrl}</p>
                <p style="color: #666666; line-height: 1.6;">This link will expire in 1 hour for security reasons.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999999; font-size: 12px;">This email was sent to your UWindsor email address. If you didn't create an account, please ignore this email.</p>
            </div>
        </body>
        </html>
      `;

      console.log('Sending verification email to:', email);
      await sendEmail(
        email,
        "Verify Your UWindsor Email - Internship Portal",
        emailContent
      );
      console.log('Verification email sent successfully to:', email);

      // Respond with success
      res.status(201).send({
        success: true,
        message: "Registration successful! Please check your UWindsor email to verify your account.",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          accountType: user.accountType,
          studentID: user.studentID,
          semester: user.semester,
        },
      });

    } catch (emailError) {
      // If email sending fails, delete the created user and token
      if (user) {
        await Users.findByIdAndDelete(user._id);
      }
      if (verificationToken) {
        await Token.findByIdAndDelete(verificationToken._id);
      }
      
      console.error('Email error:', emailError);
      return res.status(500).json({ 
        success: false, 
        message: "Failed to send verification email. Please try again later." 
      });
    }

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Registration failed" 
    });
  }
};



export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide AUser Credentials");
      return;
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password");

    if (!user) {
      next("Invalid email or password");
      return;
    }
    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }
    // compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = user.createJWT();

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};
