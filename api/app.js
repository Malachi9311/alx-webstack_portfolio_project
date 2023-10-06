require('dotenv').config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
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

/* ============================================================= */
// app.use("/pictures", express.static(path.join(__dirname, "public/pictures")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/pictures");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
/* ============================================================= */

app.get('/', (req, res) => {
  res.send('Welcome to my social media app API')
})

app.use('/api/v1/', userRouter);
app.use('/api/v1/', authorize, upload.single("picture"), postRouter);


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

