#!/usr/bin/env node
const commander = require("commander");

commander.option("-u --undo", "Remove fixed paths");

commander.parse(process.argv);
if (commander.undo) {
  const { unfixDependencies } = require("./");
  if (unfixDependencies(process.cwd())) {
    console.log("Removed absolute paths from linked dependencies");
  } else {
    console.log("Did not unfix any dependencies");
  }
} else {
  const { fixDependencies } = require("./");
  if (fixDependencies(process.cwd())) {
    console.log("Fixed linked dependencies");
  } else {
    console.log("Did not fix any dependencies");
  }
}
