const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  index(req, res) {
    const jobs = Job.get();
    const profile = Profile.get();

    const statusCount = {
      inProgress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map((job) => {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? "done" : "inProgress";

      statusCount[status]++;
      if (status === "inProgress") jobTotalHours += Number(job["daily-hours"]);

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile["value-hour"]),
      };
    });

    const freeHours = profile["hours-per-day"] - jobTotalHours;

    const indexProps = {
      index: {
        name: profile.name,
        avatar: profile.avatar,
      },
      jobs,
      statusCount,
      freeHours,
    };
    indexProps.jobs = updatedJobs;
    return res.render("index", { indexProps });
  },
};
