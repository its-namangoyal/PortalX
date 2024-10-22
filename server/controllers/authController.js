import Users from "../models/userModel.js";
import Student from "../models/studentsModel.js";

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

    // Create new user
    const user = await Users.create({
      firstName,
      lastName,
      email,
      password,
      studentID,
      accountType,
      semester: studentRegister.semester, // Add semester from student model
    });

    // Generate user token
    const token = await user.createJWT();

    // Respond with success
    res.status(201).send({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        accountType: user.accountType,
        studentID: user.studentID,
        semester: user.semester, // Include semester in the response
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
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
