import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Job } from "../models/jobSchema.js";
import { sendMail } from "../utils/sendMail.js";
import { User } from "../models/userSchema.js";

export const getAllJobs = catchAsyncError(async (req, res, next) => {
  const jobs = await Job.find({ expired: false });
  res.status(200).json({
    success: true,
    jobs,
  });
});

export const postJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const {
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
  } = req.body;

  if (!title || !description || !category || !country || !city || !location) {
    return next(new ErrorHandler("Please provide full job details.", 400));
  }

  if ((!salaryFrom || !salaryTo) && !fixedSalary) {
    return next(
      new ErrorHandler(
        "Please either provide fixed salary or ranged salary.",
        400
      )
    );
  }

  if (salaryFrom && salaryTo && fixedSalary) {
    return next(
      new ErrorHandler("Cannot Enter Fixed and Ranged Salary together.", 400)
    );
  }
  const postedBy = req.user._id;
  const job = await Job.create({
    title,
    description,
    category,
    country,
    city,
    location,
    fixedSalary,
    salaryFrom,
    salaryTo,
    postedBy,
  });
  const jobSeekers = await User.find({ role: "Job Seeker" });
  const emailAddresses = jobSeekers.map((jobSeeker) => jobSeeker.email);
  const emailString = emailAddresses.join(", ");
  const jobString = JSON.stringify(job);
  console.log(emailString);
  console.log(jobString);
  const jobHTML = `
  <html>
    <head>
      <style>
        /* Add CSS styles for better formatting */
        body {
          font-family: Arial, sans-serif;
        }
        .job-details {
          margin-bottom: 20px;
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .description {
          margin-top: 10px;
          color: #666;
        }
        /* Add more styles as needed */
      </style>
    </head>
    <body>
      <div class="job-details">
        <div class="title">${job.title}</div>
        <div class="description">${job.description}</div>
        <div>Category: ${job.category}</div>
        <div>Location: ${job.location}</div>
        <div>Salary Range: $${job.salaryFrom} - $${job.salaryTo}</div>
        <div>Posted By: ${job.postedBy}</div>
      </div>
    </body>
  </html>
`;

  sendMail(emailString, "New Job Alert", jobHTML);

  res.status(200).json({
    success: true,
    message: "Job Posted Successfully!",
    job,
  });
});

export const getmyJobs = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }
  const myjobs = await Job.find({ postedBy: req.user._id });
  res.status(200).json({
    success: true,
    myjobs,
  });
});

export const updateJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job Not Found", 404));
  }
  job = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    job,
    message: "Job Updated Successfully",
  });
});

export const deleteJob = catchAsyncError(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Job Seeker") {
    return next(
      new ErrorHandler("Job Seeker not allowed to access this resource.", 400)
    );
  }

  const { id } = req.params;
  let job = await Job.findById(id);
  if (!job) {
    return next(new ErrorHandler("Job Not Found", 404));
  }

  await job.deleteOne();
  res.status(200).json({
    success: true,
    message: "Job Deleted Successfully",
  });
});

export const getSingleJob = catchAsyncError(async(req,res,next)=>{
  const {id} = req.params;
  try {
    const job = await Job.findById(id)
    if(!job){
      return next(new ErrorHandler("Job not found",404))
    }
    res.status(200).json({
      success: true,
      job
    })
  } catch (error) {
    return next(new ErrorHandler("Invalid ID/ Cast Error",400))
  }
})