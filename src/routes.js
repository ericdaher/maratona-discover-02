const express = require("express");
const routes = express.Router();

const views = __dirname + "/views/";
const profile = {
  name: "Eric",
  avatar: "https://avatars.githubusercontent.com/u/19190300?v=4",
  "monthly-budget": 3000,
  "hours-per-day": 8,
  "days-per-week": 5,
  "vacation-per-year": 4,
};

const index = {
  name: "Eric",
  avatar: "https://avatars.githubusercontent.com/u/19190300?v=4",
};

routes.get("/", (req, res) => res.render(views + "index", { index }));
routes.get("/job", (req, res) => res.render(views + "job"));
routes.get("/job/edit", (req, res) => res.render(views + "job-edit"));
routes.get("/profile", (req, res) => res.render(views + "profile", { profile }));

module.exports = routes;
