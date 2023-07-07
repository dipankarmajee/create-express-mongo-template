#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const https = require("https");
const { execSync } = require("child_process");

// Create the target directory
const targetDir = process.argv[2] || "my-express-mongo-app";
fs.mkdirSync(targetDir);

// Fetch the template files from a remote source (e.g., GitHub)
const remoteFiles = [
  {
    url: "https://raw.githubusercontent.com/dipankarmajee/create-emongo/master/src/app.js",
    path: "app.js",
  },
  // Add more template files if necessary
];

function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve);
        });
      })
      .on("error", (error) => {
        fs.unlinkSync(filePath);
        reject(error);
      });
  });
}

async function fetchTemplateFiles() {
  for (const { url, path: filePath } of remoteFiles) {
    const fullPath = path.join(targetDir, filePath);
    await downloadFile(url, fullPath);
  }

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

  // Install npm packages
  console.log("Installing packages. This may take a moment...");
  execSync(
    "npm install express morgan body-parser cookie-parser cors helmet mongoose"
  );

  // Move back to the root directory
  process.chdir("..");
}

// Fetch the template files and install dependencies
fetchTemplateFiles()
  .then(() => {
    console.log(
      `Successfully created "create-express-mongo-template" application in "${targetDir}" directory.`
    );
  })
  .catch((error) => {
    console.error("Error fetching template files:", error);
  });
