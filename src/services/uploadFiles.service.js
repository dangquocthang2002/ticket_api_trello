const FileModel = require("../models/files.model");

const generateNewFileDocs = (files) => {
  return files.map((file) => {
    const newFile = new FileModel({
      name: file.filename.substring(file.filename.indexOf("-") + 1),
      path: file.destination,
      size: file.size,
      type: file.mimetype,
      status: "used",
    });
    return newFile;
  });
};
module.exports = { generateNewFileDocs };
