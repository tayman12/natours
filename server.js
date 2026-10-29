const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log('DB connection successful');
});

const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});

process.on('unhandledRejection', (error) => {
  console.log('UNHANDLED REJECTION, Shutting down!!');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (error) => {
  console.log('UNCAUGHT EXCEPTION, Shutting down!!');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});

console.log(x);
