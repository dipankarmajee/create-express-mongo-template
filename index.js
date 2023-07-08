#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const { spawnSync } = require("child_process");

// Create the target directory
const targetDir = process.argv[2] || "my-express-mongo-app";
fs.mkdirSync(targetDir);

// Fetch the files and folders from a remote repository
const repoUrl =
  "https://github.com/dipankarmajee/create-express-mongo-template";
const branch = "create-express-mongo-template-files";
const apiEndpoint = `https://api.github.com/repos/dipankarmajee/create-express-mongo-template/git/trees/${branch}?recursive=1`;
const headers = { "User-Agent": "CreateExpressMongoApp" };

async function fetchRepositoryContents() {
  const response = await fetch(apiEndpoint, { headers });
  const result = await response.json();
  const tree = result.tree;

  console.log("Downloading files...");

  for (const item of tree) {
    const { type, url, path: filePath } = item;

    if (type === "blob") {
      const fullPath = path.join(targetDir, filePath);
      await downloadFile(url, fullPath);
    } else if (type === "tree") {
      const directoryPath = path.join(targetDir, filePath);
      fs.mkdirSync(directoryPath, { recursive: true });
    }
  }

  console.log("Files downloaded successfully!");
}

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(url, { headers }, (response) => {
        let data = "";

        response.setEncoding("utf-8");

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const responseData = JSON.parse(data);
          const fileContent = Buffer.from(
            responseData.content,
            "base64"
          ).toString("utf-8");
          file.write(fileContent, "utf-8", (err) => {
            if (err) {
              reject(err);
            } else {
              file.end();
              resolve();
            }
          });
        });
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath);
        reject(error);
      });
  });
}

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

async function fetchTemplateFiles() {
  await fetchRepositoryContents();

  // Move into the target directory
  process.chdir(targetDir);

  // Create package.json
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

  fs.writeFileSync(
    "package.json",
    JSON.stringify(packageJson, null, 2),
    "utf-8"
  );

  console.log("Installing packages. This may take a moment...");
  installNpmPackages();

  // Move back to the root directory
  process.chdir("..");
}

// Fetch the template files and install dependencies
fetchTemplateFiles()
  .then(() => {
    console.log(
      `Successfully created "create-express-mongo-template" application in "${targetDir}" directory.`
    );
    process.exit(0); // Exit with a success status code
  })
  .catch((error) => {
    console.error("Error fetching template files:", error);
    process.exit(1); // Exit with an error status code
  });
