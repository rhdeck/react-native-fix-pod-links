const fs = require("fs");
const xcode = require("xcode");
const Path = require("path");
const Glob = require("glob");
function getPodPath(basepath) {
  if (!basepath) basepath = process.cwd();
  const ret = Path.join(basepath, "ios", "Pods", "**");
  return ret;
}
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
      if (fs.lstatSync(modulePath).isSymbolicLink()) {
        //This is linked! We should look into this
        const globs = Glob.sync(
          Path.join(modulePath, "**", "project.pbxproj")
        ).filter(glob => {
          return !glob.match(projectPath + ".*/node_modules/");
        });
        globs.map(glob => {
          let proj = xcode.project(glob);
          proj.parseSync();
          try {
            proj.removeFromHeaderSearchPaths(getPodPath(basepath));
          } catch (e) {}
          try {
            proj.removeFromFrameworkSearchPaths(getPodPath(basepath));
          } catch (e) {}
          try {
            const searchPath = '"' + getPodPath(basepath) + '"';
            proj.addToHeaderSearchPaths(searchPath);
            proj.addToFrameworkSearchPaths(searchPath);
            const str = proj.writeSync();
            fs.writeFileSync(glob, str);
            return ret;
          } catch (e) {
            console.log(e);
          }
        });
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
      if (fs.lstatSync(modulePath).isSymbolicLink()) {
        //This is linked! We should look into this
        const globs = Glob.sync(
          Path.join(modulePath, "**", "project.pbxproj")
        ).filter(glob => {
          return !glob.match(projectPath + ".*/node_modules/");
        });
        globs.map(glob => {
          let proj = xcode.project(glob);
          proj.parseSync();
          try {
            proj.removeFromHeaderSearchPaths(getPodPath(basepath));
          } catch (e) {}
          try {
            proj.removeFromFrameworkSearchPaths(getPodPath(basepath));
          } catch (e) {}
          const str = proj.writeSync();
          fs.writeFileSync(glob, str);
          console.log("Removed search path from linked module", k);
          ret++;
        });
      } else {
      }
    });
  return ret;
}
module.exports = {
  fixDependencies,
  unfixDependencies
};
