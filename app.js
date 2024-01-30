const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const NodeCache = require('node-cache');

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

const corsOptions = {
  origin: ["https://javas-ports-frontend.vercel.app", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "DELETE", "PUT"],
};

app.use(cors(corsOptions));

//Route imports
const user = require("./routes/UserRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const coupon = require("./routes/couponRoute");
const admin = require("./routes/dashboardRoute");

app.use("/api/v1", user);
app.use("/api/v1/", product);
app.use("/api/v1/", order);
app.use("/api/v1/", coupon);
app.use("/api/v1/", admin);

module.exports = app;

app.get("/", (req, res) => res.send(`<h1>working fine</h1>`));
//middleware
app.use(errorMiddleware);
