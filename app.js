var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");

// MongoDB
const mongoose = require("mongoose");
const cors = require("cors");

// muốn sài được thì phải rq nó ở đây
require("./mongo/categories.model");
require("./mongo/product.model");
require("./mongo/product.controller");
require("./mongo/./categories.controller");

// Khai báo router
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cataRouter = require("./routes/category");
var listproRouter = require("./routes/products");
var publishRouter = require("./routes/publish");
var authorRouter = require("./routes/author");

var app = express();
// Sử dụng body-parser middleware để phân tích dữ liệu từ body của yêu cầu HTTP
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// cho phép các domain khác gọi tới api
app.use(cors());

// Kết nối  database MongooBD
mongoose
  .connect("mongodb://localhost:27017/booktopia")
  .then(() => console.log("Kết nối database thành công"))
  .catch((err) => console.log("Thất bại", err));

// Định nghĩa các trang routing
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/category", cataRouter);
app.use("/products", listproRouter);
app.use("/publish", publishRouter);
app.use("/author", authorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
