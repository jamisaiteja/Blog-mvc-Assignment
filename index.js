const express = require("express");
const mongoose = require("mongoose");
const PORT = 8000;
const userRouter = require("./routes/user.route");
const blogRouter = require("./routes/blog.route");
const rateLimiter = require("./lib/rateLimiter/rateLimiter");

const app = express();
app.use(express.json());

//middleware
app.use(rateLimiter);

//DB Connection
mongoose
  .connect(
    "mongodb+srv://jami:JrgsMpsG2HQEWda0@cluster0.mpbocjf.mongodb.net/blog_store?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB server is Connected");
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed");
    throw err; //crashing the server if DB not connected
  });

//health route
app.get("/", (req, res) => {
  res.json({ mesaage: "Success!" });
});

app.use("/users", userRouter);
app.use("/blogs", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is Listening to Port:${PORT}`);
});
