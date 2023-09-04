const mongoose = require("mongoose");

const connectdb = async () => {
  mongoose.set("strictQuery", true);

  mongoose
    .connect(process.env.DB_URL)
    .then((result) => {
      console.log("Database is Connected");
    })
    // .catch((err) => {
    //   console.log(err);
    // });
};

module.exports = connectdb;
