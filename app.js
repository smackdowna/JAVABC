const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const NodeCache = require("node-cache");

//config
dotenv.config({ path: "./config/config.env" });

exports.myCache = new NodeCache();
app.use(express.json());
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: ["https://javas-ports-frontend.vercel.app","http://localhost:3000","https://java-sports-livid.vercel.app","https://java-admin-panel.vercel.app","https://java-sports-six.vercel.app","https://www.javasports.in","www.javasports.in","https://javasports.in"],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  })
);

//Route imports
const user = require("./routes/UserRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const coupon = require("./routes/couponRoute");
const admin = require("./routes/dashboardRoute");
const contact = require("./routes/contactRoute");

app.use("/api/v1", user);
app.use("/api/v1/", product);
app.use("/api/v1/", order);
app.use("/api/v1/", coupon);
app.use("/api/v1/", admin);
app.use("/api/v1/", contact);

module.exports = app;

app.get("/", (req, res) => res.send(`<h1>working fine</h1>`));

app.get("/api/v1/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);

//middleware
app.use(errorMiddleware);
