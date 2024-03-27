import express from "express";
import {
  getAllJobs,
  postJob,
  getmyJobs,
  updateJob,
  deleteJob,
  getSingleJob
} from "../controllers/jobController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get("/getalljobs", getAllJobs);
router.post("/postjob", isAuthenticated, postJob);
router.get("/getmyjobs", isAuthenticated, getmyJobs);
router.put("/updatejob/:id", isAuthenticated, updateJob);
router.delete("/deletejob/:id", isAuthenticated, deleteJob);
router.get("/:id", isAuthenticated, getSingleJob);

export default router;