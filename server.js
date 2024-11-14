import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';

import db from './src/models/index.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';

if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config();
}

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: 'clutch-assessment-session',
    keys: ['COOKIE_SECRET'],
    httpOnly: true,
  })
);

const Role = db.role;

let server;
let isConnected = false;

const connectToDatabase = async () => {
  try {
    db.mongoose.set('strictQuery', true);
    await db.mongoose.connect(
      `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Successfully connected to MongoDB.');
    isConnected = true;
    initial();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  if (isConnected) {
    await db.mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

const startServer = () => {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
  authRoutes(app);
  userRoutes(app);
};

const stopServer = () => {
  if (server) {
    server.close();
    console.log('Express server closed.');
  }
};

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) {
          console.log('error', err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

if (process.env.NODE_ENV !== 'test') {
  connectToDatabase().then(() => {
    startServer();
  });
}

export { app, connectToDatabase, disconnectDatabase, startServer, stopServer };
