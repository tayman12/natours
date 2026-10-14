const dotenv = require('dotenv');
dotenv.config({ path: `./config.env` });

const app = require('./app');

console.log(`NODE_ENV is ${process.env.NODE_ENV} from server`);

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
