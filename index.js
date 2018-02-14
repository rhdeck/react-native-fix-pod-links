const fs = require("fs");
const xcode = require("xcode");
const Path = require("path");
const Glob = require("glob");
function fixDependencies(basepath = process.cwd()) {
  const projectPath = Path.resolve(basepath, "package.json");
  const package = require(projectPath);
  const dependencies = package.dependencies;
  var ret = 0;
  //Look for my IOS directory - usually in ios
  const podglobs = Glob.sync(Path.join(basepath, "ios", "Pods"));
  if (!podglobs) {
    console.log(
      "Warning: Found no installed pods, so this might not really do anything interesting for you"
    );
  }
  Object.keys(dependencies)
    .filter(k => {
      return k != "react-native";
    })
    .map(k => {
      //Nodepath
      const modulePath = Path.join(basepath, "node_modules", k);
      //Look for ios directory
      console.log("Checking this module", modulePath);
      if (fs.lstatSync(modulePath).isSymbolicLink()) {
        console.log("Found linked module ", k);
        //This is linked! We should look into this
        const globs = Glob.sync(
          Path.join(modulePath, "**", "project.pbxproj")
        ).filter(glob => {
          return !glob.match(projectPath + ".*/node_modules/");
        });
        globs.map(glob => {
          let proj = xcode.project(glob);
          proj.parseSync();
          proj.addToHeaderSearchPaths(
            '"' + Path.join(basepath, "ios", "Pods", "**") + '"'
          );
          const str = proj.writeSync();
          fs.writeFileSync(glob, str);
          return ret;
        });
      } else {
        console.log("Module not a link:", modulePath);
      }
    });
  return ret;
}
function unfixDependencies(basepath = process.cwd()) {
  const projectPath = Path.resolve(basepath, "package.json");
  const package = require(projectPath);
  const dependencies = package.dependencies;
  var ret = 0;
  //Look for my IOS directory - usually in ios
  const podglobs = Glob.sync(Path.join(basepath, "ios", "Pods"));
  if (!podglobs) {
    console.log(
      "Warning: Found no installed pods, so this might not really do anything interesting for you"
    );
  }
  Object.keys(dependencies)
    .filter(k => {
      return k != "react-native";
    })
    .map(k => {
      //Nodepath
      const modulePath = Path.join(basepath, "node_modules", k);
      //Look for ios directory
      console.log("Checking this module", modulePath);
      if (fs.lstatSync(modulePath).isSymbolicLink()) {
        console.log("Found linked module ", k);
        //This is linked! We should look into this
        const globs = Glob.sync(
          Path.join(modulePath, "**", "project.pbxproj")
        ).filter(glob => {
          return !glob.match(projectPath + ".*/node_modules/");
        });
        globs.map(glob => {
          let proj = xcode.project(glob);
          proj.parseSync();
          targetpath = Path.join(basepath, "ios", "Pods", "**");

          proj.removeFromHeaderSearchPaths(targetpath);
          const str = proj.writeSync();
          fs.writeFileSync(glob, str);
          ret++;
        });
      } else {
        console.log("Module not a link:", modulePath);
      }
    });
  return ret;
}
module.exports = {
  fixDependencies,
  unfixDependencies
};
