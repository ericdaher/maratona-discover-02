module.exports = {
  remainingDays(job) {
    const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();
    const date = new Date(job.createdAt);
    const dueDay = date.getDate() + Number(remainingDays);
    const dueDate = date.setDate(dueDay);

    const timeDiff = dueDate - Date.now();
    const day = 1000 * 60 * 60 * 24;
    const dayDiff = Math.floor(timeDiff / day);

    return dayDiff;
  },
  calculateBudget: (job, valueHour) => valueHour * job["total-hours"],
};
