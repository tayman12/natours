const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_LOCAL).then((con) => {
  console.log('DB connection successful');
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
