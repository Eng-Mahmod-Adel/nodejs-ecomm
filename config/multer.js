const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (req, file, cb) => {
    if (file.mimetype.starstWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError("Onle imgae", 400), false);
    }
  };
  const upload = multer({storage: multerStorage, fileFilter: multerFilter});
  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) =>
  multerOptions().fields(arrayOfFields);
