const { fixDependencies, unfixDependencies } = require("./");
module.exports = [
  {
    name: "addpodlinks",
    description: "Add pod references for linked native modules",
    func: () => {
      fixDependencies(process.cwd());
    }
  },
  {
    name: "removepodlinks",
    description: "Remove pod references for linked native modules",
    func: () => {
      unfixDependencies(process.cwd());
    }
  }
];
