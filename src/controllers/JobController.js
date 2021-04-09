const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async create(req, res) {
    const job = req.body;
    job.createdAt = Date.now();

    await Job.create(job);
    return res.redirect("/");
  },
  render(req, res) {
    return res.render("job");
  },
  async show(req, res) {
    const profile = await Profile.get();
    const jobs = await Job.get();

    const jobId = req.params.id;
    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) return res.send("Job not found!");
    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },
  async update(req, res) {
    const jobId = req.params.id;

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    await Job.set(updatedJob, jobId);

    return res.redirect("/job/" + jobId);
  },
  async delete(req, res) {
    const jobId = req.params.id;

    await Job.delete(jobId);

    return res.redirect("/");
  },
};
