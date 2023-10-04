require('dotenv').config();
const express = require('express');
const app = express();

// connectDB
const connectDB = require('./db/connect');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my social media app API')
})


// Spinning up Server and Database
const port = process.env.PORT;
const url = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();

