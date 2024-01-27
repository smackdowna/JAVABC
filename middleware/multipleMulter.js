const multer = require("multer");

const storage = multer.memoryStorage();

const multipleUpload = multer({ storage }).array("images", 4); // Change "files" to your desired field name and set the maximum number of files

module.exports = multipleUpload;