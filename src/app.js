const express = require("express"); //create express js function
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit"); //set limit that you req 15 times
const { errorResponse } = require("./controllers/responseController");
const app = express(); //here call the function in app because every route use use app
const cookieParser = require("cookie-parser");

const userRouter = require("./routers/userRouter");
const seedRouter = require("./routers/seedRouter");
const authRouter = require("./routers/authRouter");
const categoryRouter = require("./routers/categoryRouter");
const productRouter = require("./routers/productRouter");

const rateLimiter = rateLimit({
  windowMS: 1 * 60 * 1000, // 1 minute
  max: 15,
  message: "Too many request from the this IP.Please try again later",
});

app.use(cookieParser());
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev")); //to see status code
app.use(bodyParser.json({ limit: "1mb" })); //express js building middleware--for request body data(json) receive
app.use(bodyParser.urlencoded({ extended: true })); //express js building middleware-- for working form data

//call the app
app.use("/api/users", userRouter);
app.use("/api/seed", seedRouter);
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);

// app.get('/test',(req,res)=>{
//     res.status(200).send({
//      message:'Api is working........ ',
//     });
// });

//client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

//server error handling-> all the errors
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
