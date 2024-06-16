const multer = require('multer');
const { nanoid } = require('nanoid');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${nanoid(16)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
