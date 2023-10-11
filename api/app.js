require('dotenv').config();
const express = require('express');
const app = express();
const multer = require('multer');
const bodyParser = require('body-parser');

// connectDB
const connectDB = require('./db/connect');
// Routes
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const authorize = require('./middleware/Authorize');

app.use(express.json());
app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to my social media app API')
})

app.use('/api/v1/', userRouter);
app.use('/api/v1/', authorize, postRouter);


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

