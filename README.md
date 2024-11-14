# Clutch Assessment - Express + MongoDB

This project is a Express-based application designed for the Clutch Assessment, including features for user sign-in and sign-up with Docker integration for MongoDB.

### Setting Up Environment Variables

1. **Create Environment Files**: Copy the provided example environment files.

   ```bash
   cp .env.example .env
   ```

2. Configure `.env`: Open the `.env` file and specify the required environment variables, such as database credentials, application port, and JWT settings.

### Installation and Running the Server

1. Install Packages
   Install the necessary packages using npm:
   `bash
    npm install
    `

2. Running the Server in Development Mode
   Start the Express application in development mode:
   `bash
    npm run start
    `
   This will start the server on the port specified in your .env file (default is 3000).

### Docker Setup

To run the application with Docker, including a Mongo database:

1.  Build and Start Docker Containers
    Use Docker Compose to start both the Express application and Mongo database:
    `bash
    docker-compose up --build
    `
    This command will:

          - Build and start a Mongo container using the specified credentials.
          - Build and start the Express container, connecting it to the database.
          - The application will be accessible at http://localhost:3000 (or the port specified in .env).

2.  Stopping Containers
    To stop the running Docker containers:
    `bash
    docker-compose down
    `

3.  Resetting the Database Volume
    If you need to reset the Mongo database by removing the Docker volume, use:
    `bash
    docker-compose down -v
    `

### Testing

This project includes end-to-end (e2e) tests. Follow the instructions below to run each type of test. To run unit tests:

To run e2e tests:

```
npm run test:e2e
```

Important: Before running e2e tests, ensure that `.env.test` file exists in the root directory. This file should contain environment variables specific to the test environment, such as database credentials and JWT secrets.

### Samples Requests

1. **Endpoint**: `POST http://localhost:3000/api/auth/signup`. This endpoint allows a new user to register by providing their email, password, and roles.

   Payload Example

   ```json
   {
     "email": "admin@gmail.com",
     "password": "abc",
     "roles": ["admin"]
   }
   ```

2. **Endpoint**: `POST http://localhost:3000/api/auth/signin`. This endpoint allows user to signin by providing their email, password.

   Payload Example

   ```json
   {
     "email": "admin@gmail.com",
     "password": "abc"
   }
   ```

3. **Endpoint**: `GET http://localhost:3000/api/users?page=${page}&pageCount=${pageCount}`. This is only authorized for admin users and allow users to search users.
