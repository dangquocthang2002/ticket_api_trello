const sharp = require("sharp");
const fs = require("fs");

const {
  isVideo,
  isPDF,
  isText,
  isImage,
  isGif,
  isSvg,
  isPNG,
} = require("../utils/isImage.util");

const { UPLOADS_PATH } = require("../config/index");

const handleFile = () => {
  return async (req, res, next) => {
    try {
      ["videos", "images", "docs", "others"].forEach((folder) => {
        if (!fs.existsSync(`${UPLOADS_PATH}/${folder}`)) {
          fs.mkdirSync(`${UPLOADS_PATH}/${folder}`, { recursive: true });
        }
      });

      req.files = await Promise.all(
        req.files.map(async (file) => {
          const fileSize = file.size / (1024 * 1024);
          file.filename = Date.now() + "-" + file.originalname;
          file.destination = null;
          if (isImage(file) && !isSvg(file) && !isGif(file)) {
            const quality =
              fileSize > 4 && fileSize < 10
                ? 70
                : fileSize > 11 && fileSize < 30
                ? 50
                : fileSize > 31 && fileSize < 100
                ? 30
                : 100;
            if (isPNG(file)) {
              await sharp(file.buffer)
                .png(
                  quality !== 100
                    ? {
                        quality: quality,
                      }
                    : {}
                )
                .toFile(`${UPLOADS_PATH}/images/${file.filename}`);
            } else {
              await sharp(file.buffer)
                .jpeg(
                  quality !== 100
                    ? {
                        quality: quality,
                      }
                    : {}
                )
                .toFile(`${UPLOADS_PATH}/images/${file.filename}`);
            }
            file.destination = `uploads/images/${file.filename}`;
          } else {
            const folderName =
              isVideo(file) ||
              isPDF(file) ||
              isText(file) ||
              isImage(file) ||
              "others";

            fs.writeFileSync(
              `${UPLOADS_PATH}/${folderName}/${file.filename}`,
              file.buffer
            );
            file.destination = `uploads/${folderName}/${file.filename}`;
          }
          return file;
        })
      );
      next();
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  };
};
module.exports = handleFile;
