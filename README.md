# Create Express Mongo Template

🐳 Create Express Mongo Template is a command-line tool to quickly set up an Express.js application with MongoDB integration.

## Features

- 🚀 Generates an Express.js application with a structured folder hierarchy.
- ⚙️ Includes common packages like Express, Morgan, Body Parser, Cookie Parser, CORS, Helmet, and Mongoose.
- 📦 Integrates MongoDB for seamless database connectivity.
- 💡 Provides a clean and organized starting point for your Express.js projects.

## Getting Started

### Prerequisites

Before using Create Express Mongo Template, ensure that you have Node.js and npm installed on your machine.

### Usage

Generate a new Express.js application with MongoDB integration:

```shell
create-express-mongo-template <project-name>
```

Replace <project-name> with your desired project name. This command will create a new directory, set up the folder structure, and install the necessary packages.

Directory Structure
The generated Express.js application will have the following directory structure:

- <project-name>
  - public
  - src
    - routes
    - views
    - controllers
    - models
    - config
  - package.json
  - index.js

The public directory is for static assets like CSS, JavaScript, and images.
The src directory contains the source code, including routes, views, controllers, models, and config folders.
The package.json file includes project metadata and dependencies.
The index.js file is the entry point for your Express.js application.
Customization
Customize the generated Express.js application to fit your project's requirements. Modify the routes, views, controllers, models, and configuration files. Feel free to add additional packages or dependencies based on your needs.

License
This project is licensed under the MIT License.

Contributing
Contributions are welcome! Please open an issue or submit a pull request on the GitHub repository.
