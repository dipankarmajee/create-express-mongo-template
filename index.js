#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

// Create the target directory
const targetDir = process.argv[2] || "my-express-mongo-app";
fs.mkdirSync(targetDir);

/* CREATE FOLDERS AND FILES */
function createAppFiles() {
  const filesAndFolders = [
    { name: "app.js", content: "" },
    { name: ".env", content: "" },
    { name: ".gitignore", content: "" },
    {
      name: "config",
      isDirectory: true,
      files: [
        { name: "db.js", content: "" },
        { name: "express.js", content: "" },
      ],
    },
    { name: "controllers", isDirectory: true },
    { name: "middlewares", isDirectory: true },
    { name: "models", isDirectory: true },
    { name: "public", isDirectory: true },
    { name: "routes", isDirectory: true },
    { name: "views", isDirectory: true },
  ];

  for (const item of filesAndFolders) {
    const { name, content, isDirectory, files } = item;
    const itemPath = path.join(targetDir, name);

    if (isDirectory) {
      fs.mkdirSync(itemPath);
      if (files && files.length > 0) {
        for (const file of files) {
          const { name: fileName, content: fileContent } = file;
          const filePath = path.join(itemPath, fileName);
          fs.writeFileSync(filePath, fileContent);
        }
      }
    } else {
      fs.writeFileSync(itemPath, content);
    }
  }

  console.log("Files and folders created successfully!");
}

/* INSTALL NPM PACKAGES */
function installNpmPackages() {
  const installCmd = process.platform === "win32" ? "npm.cmd" : "npm";
  const installArgs = [
    "install",
    "express",
    "morgan",
    "body-parser",
    "cookie-parser",
    "cors",
    "helmet",
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
  createAppFiles();

  // Move into the target directory
  process.chdir(targetDir);

  // Create package.json
  await createPackageJson();

  // Move back to the root directory
  process.chdir("..");

  console.log(
    `Successfully created "create-express-mongo-template" application in "${targetDir}" directory.`
  );
}

// Create the template files and folders
createTemplateFiles();
