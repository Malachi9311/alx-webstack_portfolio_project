require('dotenv').config();
const express = require('express');
const app = express();
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express')

// connectDB
const connectDB = require('./db/connect');
// Routes
const userRouter = require('./routes/userRoutes');
const postRouter = require('./routes/postRoutes');
const authorize = require('./middleware/Authorize');
// Documentation
const options = {
  definition:{
    openapi: "3.0.0",
    info: {
      title: "Social Media API",
      version: "1.0.0",
      description: "This is an API for a social media platform",
      contact: {
        name: "Malachi",
        email: "ntuthuko93dlamini@gmail.com",
      },
    },
    servers: [
      {url: 'http://localhost:3001/api/v1'}
    ],
    
  },
  apis: ["./routes/*.js"],
};

const swag = swaggerjsdoc(options);


app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to my social media app API')
})

app.use('/api/v1/', userRouter);
app.use('/api/v1/', authorize, postRouter);


app.use('/docs', swaggerui.serve, swaggerui.setup(swag));

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

