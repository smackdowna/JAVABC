  const app = require("./app");
  const dotenv = require("dotenv");
  const connectDB = require("./config/database");
  const cloudinary = require("cloudinary");


  app.get("/", (req, res) => {
    res.send("Working fine");
  });

  //handling uncaught
  process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to uncaught exception`);
    process.exit(1);
  });

  //config
  dotenv.config({ path: "./config/config.env" });

  connectDB();

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const server = app.listen(process.env.PORT, '0.0.0.0',() => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
  });



  //Unhandled Promise Rejection
  process.on("unhandledRejection", (err) => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting Down the server due to unhandled promise rejection`);

    server.close(() => {
      process.exit(1);
    });
  });
