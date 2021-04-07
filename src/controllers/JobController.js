const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  create(req, res) {
    const jobs = Job.get();
    const job = req.body;

    job.createdAt = Date.now();
    job.id = (Job.get()[Job.get().length - 1]?.id || 0) + 1;

    jobs.push(job);
    return res.redirect("/");
  },
  render(req, res) {
    return res.render("job");
  },
  show(req, res) {
    const profile = Profile.get();
    const jobs = Job.get();

    const jobId = req.params.id;
    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) return res.send("Job not found!");
    job.budget = JobUtils.calculateBudget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },
  update(req, res) {
    const jobs = Job.get();
    const jobId = req.params.id;
    const job = jobs.find((job) => Number(job.id) === Number(jobId));

    if (!job) return res.send("Job not found!");
    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    Job.set(
      jobs.map((job) => {
        if (Number(job.id) === Number(jobId)) job = updatedJob;
        return job;
      })
    );

    return res.redirect("/job/" + jobId);
  },
  delete(req, res) {
    const jobId = req.params.id;

    Job.delete(jobId);

    return res.redirect("/");
  },
};
