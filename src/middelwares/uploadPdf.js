const multer = require("multer");

exports.uploadPdf = (imageFile) => {
  //storage destination
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, ""));
    },
  });
  //file filter function
  const fileFilter = (req, file, cb) => {
    if (file.fieldname === imageFile) {
      if (!file.originalname.match(/\.(pdf||PDF)$/)) {
        req.fileValidationError = {
          message: "Only PDF  are allowed",
        };
        return cb;
      }
      cb(null, true);
    }
  };

  //max size for upload file
  const sizeInMB = 4;
  const maxSize = sizeInMB * 1024 * 1024;

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSize,
    },
  }).fields([
    {
      name: imageFile,
      maxCount: 1,
    },
  ]);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (req.fileValidationError) {
        return res.status(400).send(req.fileValidationError);
      }
      if (!req.files && !err) {
        return res.status(400).send({
          message: "Please select file to upload",
        });
      }
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).send({
            message: "Max file size is 4MB",
          });
        }
        return res.status(400).send(err);
      }
      return next();
    });
  };
};
