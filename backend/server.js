const express=require('express'); 
const mongoose=require('mongoose');
const cors=require('cors');
const env=require('dotenv'); 
// const userRoutes=require('./routes/userRoute');


const app=express();
app.use(cors()); 
app.use(express.json()); 
// app.use('/', userRoutes); 
mongoose.connect(env.config().parsed.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "bookXpress",
})
.then(() => {
  app.listen(()=>{
    console.log("Running");
    
 });
})
.catch((error) => {
  console.error("MongoDB connection error:", error);
});



