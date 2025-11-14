const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const env = require('dotenv');

env.config();  // load .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "bookXpress",
})
.then(() => {
  console.log("MongoDB Connected");
  
  app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});
