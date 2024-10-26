import mongoose from "mongoose";
import Projects from "../models/projectsModel.js";
import Companies from "../models/companiesModel.js";

// Added 
import Users from "../models/userModel.js";
import Applications from "../models/applicationsModel.js";

export const createProject = async (req, res, next) => {
  try {
    const {
      projectTitle,
      projectType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
      semester,
    } = req.body;

    if (
      !projectTitle ||
      !salary ||
      !requirements ||
      !desc
    ) {
      next("Please Provide All Required Fields");
      return;
    }

    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const projectPost = {
      projectTitle,
      projectType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      company: id,
      semester,
    };

    const project = new Projects(projectPost);
    await project.save();

    //update the company information with project id
    const company = await Companies.findById(id);

    company.projectPosts.push(project._id);
    const updateCompany = await Companies.findByIdAndUpdate(id, company, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Project Posted Successfully",
      project,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const {
      projectTitle,
      projectType,
      location,
      salary,
      vacancies,
      experience,
      desc,
      requirements,
    } = req.body;
    const { projectId } = req.params;

    if (
      !projectTitle ||
      !projectType ||
      !location ||
      !salary ||
      !desc ||
      !requirements
    ) {
      next("Please Provide All Required Fields");
      return;
    }
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const projectPost = {
      projectTitle,
      projectType,
      location,
      salary,
      vacancies,
      experience,
      detail: { desc, requirements },
      _id: projectId,
    };

    await Projects.findByIdAndUpdate(projectId, projectPost, { new: true });

    res.status(200).json({
      success: true,
      message: "Project Post Updated SUccessfully",
      projectPost,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getProjectPosts = async (req, res, next) => {
  try {
    const { search, sort, location, jtype, exp } = req.query;
    const types = jtype?.split(","); //full-time,part-time
    const experience = exp?.split("-"); //2-6

    let queryObject = {};

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    if (jtype) {
      queryObject.projectType = { $in: types };
    }

    //    [2. 6]

    if (exp) {
      queryObject.experience = {
        $gte: Number(experience[0]) - 1,
        $lte: Number(experience[1]) + 1,
      };
    }

    if (search) {
      const searchQuery = {
        $or: [
          { projectTitle: { $regex: search, $options: "i" } },
          { projectType: { $regex: search, $options: "i" } },
        ],
      };
      queryObject = { ...queryObject, ...searchQuery };
    }

    let queryResult = Projects.find(queryObject)
      .select('projectTitle projectType location salary vacancies experience detail company semester createdAt')
      .populate({
        path: "company",
        select: "-password",
      });

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("projectTitle");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-projectTitle");
    }

    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    //records count
    const totalProjects = await Projects.countDocuments(queryResult);
    const numOfPage = Math.ceil(totalProjects / limit);

    queryResult = queryResult.limit(limit * page);

    const projects = await queryResult;

    res.status(200).json({
      success: true,
      totalProjects,
      data: projects,  // This will now include the semester field for each project
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await Projects.findById({ _id: id }).populate({
      path: "company",
      select: "-password",
    });

    if (!project) {
      return res.status(200).send({
        message: "Project Post Not Found",
        success: false,
      });
    }

    //GET SIMILAR project POST
    const searchQuery = {
      $or: [
        { projectTitle: { $regex: project?.projectTitle, $options: "i" } },
        { projectType: { $regex: project?.projectType, $options: "i" } },
      ],
    };

    let queryResult = Projects.find(searchQuery)
      .populate({
        path: "company",
        select: "-password",
      })
      .sort({ _id: -1 });

    queryResult = queryResult.limit(6);
    const similarProjects = await queryResult;

    res.status(200).json({
      success: true,
      data: project,
      similarProjects,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const deleteProjectPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    await Projects.findByIdAndDelete(id);

    res.status(200).send({
      success: true,
      messsage: "Project Post Delted Successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// Apply for project function
export const applyForProject = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.body.user.userId;

  try {
    // Check if the project exists
    const project = await Projects.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if the user exists
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has already applied for this project
    const existingApplication = await Applications.findOne({ project: projectId, student: userId });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this project' });
    }

    // Create a new application
    const newApplication = new Applications({
      project: projectId,
      student: userId,  // Change this from 'applicant' to 'student'
      status: 'pending'
    });

    await newApplication.save();

    res.status(200).json({ success: true, message: 'Application submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
