const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";
const Profile = {
  data: {
    name: "Eric",
    avatar: "https://github.com/ericdaher.png",
    "monthly-budget": 3000,
    "hours-per-day": 8,
    "days-per-week": 5,
    "vacation-per-year": 4,
    "value-hour": 75,
  },
  controllers: {
    index(req, res) {
      return res.render(views + "profile", { profile: Profile.data });
    },
    update(req, res) {
      const data = req.body;

      const weeks_per_year = 52;
      const weeks_per_month = (weeks_per_year - data["vacation-per-year"]) / 12;
      const week_total_hours = data["hours-per-day"] * data["days-per-week"];
      const monthly_total_hours = week_total_hours * weeks_per_month;

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": data["monthly-budget"] / monthly_total_hours,
      };

      return res.redirect("/profile");
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 1,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 3,
      "total-hours": 45,
      created_at: Date.now(),
    },
  ],
  controllers: {
    index(req, res) {
      const updated_jobs = Job.data.map((job) => {
        const remaining = Job.services.remaining_days(job);
        const status = remaining <= 0 ? "done" : "progress";

        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculate_budget(job, Profile.data["value-hour"]),
        };
      });

      index_props.jobs = updated_jobs;
      return res.render(views + "index", { index_props });
    },
    create(req, res) {
      const job = req.body;
      job.created_at = Date.now();
      job.id = (Job.data[Job.data.length - 1]?.id || 0) + 1;

      Job.data.push(job);
      return res.redirect("/");
    },
    render(req, res) {
      return res.render(views + "job");
    },
    show(req, res) {
      const job_id = req.params.id;
      const job = Job.data.find((job) => Number(job.id) === Number(job_id));

      if (!job) return res.send("Job not found!");
      job.budget = Job.services.calculate_budget(job, Profile.data["value-hour"]);

      return res.render(views + "job-edit", { job });
    },
    update(req, res) {
      const job_id = req.params.id;
      const job = Job.data.find((job) => Number(job.id) === Number(job_id));

      if (!job) return res.send("Job not found!");
      const updated_job = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"],
      };

      Job.data = Job.data.map((job) => {
        if (Number(job.id) === Number(job_id)) job = updated_job;
        return job;
      });

      return res.redirect("/job/" + job_id);
    },
    delete(req, res) {
      const job_id = req.params.id;

      Job.data = Job.data.filter((job) => Number(job.id) !== Number(job_id));

      return res.redirect("/");
    },
  },
  services: {
    remaining_days(job) {
      const remaining_days = (job["total-hours"] / job["daily-hours"]).toFixed();
      const date = new Date(job.created_at);
      const due_day = date.getDate() + Number(remaining_days);
      const due_date = date.setDate(due_day);

      const time_diff = due_date - Date.now();
      const day = 1000 * 60 * 60 * 24;
      const day_diff = Math.floor(time_diff / day);

      return day_diff;
    },
    calculate_budget: (job, value_hour) => value_hour * job["total-hours"],
  },
};

const index = {
  name: "Eric",
  avatar: "https://avatars.githubusercontent.com/u/19190300?v=4",
};

const index_props = { index, jobs: Job.data };

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.render);
routes.post("/job", Job.controllers.create);
routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
