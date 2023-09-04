const express = require("express");
const morgan = require("morgan");
const path = require("path");

const catRoute = require("./routes/categoryRoute");
const subCatRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const cartRoute = require("./routes/cartRoute");

require("dotenv").config({ path: "config.env" });
const app = express();

// connect to database
const connectdb = require("./config/connectdb");

const errorHandler = require("./middlewares/errorHandler");
const ApiError = require("./utils/apiError");
connectdb();

// middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

app.use("/api/category", catRoute);
app.use("/api/subcategory", subCatRoute);
app.use("/api/brand", brandRoute);
app.use("/api/product", productRoute);
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/cart", cartRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

const port = process.env.PORT || 2300;
const server = app.listen(port, () => {
  console.log(`server is running ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err}`);
  server.close(() => {
    console.error("Shutting down....");
    process.exit(1);
  });
});
