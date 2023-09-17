#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// Create the target directory
const targetDir = process.argv[2] || "my-express-mongo-app";
fs.mkdirSync(targetDir);

/* CREATE FOLDERS AND FILES */
function copyFolderSync(sourceDir, targetDir) {
  // Create the target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir);
  }

  // Read the contents of the source directory
  const files = fs.readdirSync(sourceDir);

  // Iterate over the files and directories
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    // Check if the current item is a directory
    if (fs.statSync(sourcePath).isDirectory()) {
      // Recursively copy the directory
      copyFolderSync(sourcePath, targetPath);
    } else {
      // Copy the file
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}

function copyAndExecuteFolder() {
  const sourceDir = path.join(__dirname, "template");
  const targetDir = process.argv[2] || "my-express-mongo-app";

  // Copy the contents of the folder to the target directory
  copyFolderSync(sourceDir, targetDir);

  // Move into the target directory
  process.chdir(targetDir);

  // Execute the code or perform any other desired operations

  // Move back to the root directory
  process.chdir("..");

  console.log(
    `Successfully copied and executed folder "${sourceDir}" into "${targetDir}" directory.`
  );
}

/* INSTALL NPM PACKAGES */
function installNpmPackages() {
  const installCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const installArgs = [
    "install",
    "express",
    "morgan",
    "cors",
    "mongoose",
    "dotenv",
    "--save",
  ];
  const installResult = spawnSync(installCmd, installArgs, {
    stdio: "inherit",
  });

  if (installResult.status === 0) {
    console.log("Packages installed successfully!");
  } else {
    console.error("Error installing packages:", installResult.error);
    process.exit(1); // Exit with an error status code
  }
}

/* CREATE PACKAGE.JSON  */
// If Promise is resolved then installNpmPackages() will be called inside this function.
function createPackageJson() {
  return new Promise((resolve, reject) => {
    const appName = process.argv[3] || "my-express-mongo-app";
    const packageJson = {
      name: appName,
      version: "1.0.0",
      description: "",
      main: "app.js",
      scripts: {
        start: "node app.js",
      },
      author: "",
      license: "MIT",
    };

    // Creating package.json file
    fs.writeFile(
      "package.json",
      JSON.stringify(packageJson, null, 2),
      "utf-8",
      (err) => {
        if (err) {
          console.error("Error creating package.json:", err);
          reject(err);
        } else {
          console.log("package.json created successfully!");
          console.log("Installing packages. This may take a moment...");
          installNpmPackages();
          // Move back to the root directory
          process.chdir("..");
          resolve();
        }
      }
    );
  });
}

async function createTemplateFiles() {
  copyAndExecuteFolder();

  // Move into the target directory
  process.chdir(targetDir);

  // Create package.json
  await createPackageJson();

  // Move back to the root directory
  process.chdir("..");

  console.log(
    `File and packages are successfully downloaded.
    cd "${targetDir}" directory.`
  );
}

// Create the template files and folders
createTemplateFiles();
