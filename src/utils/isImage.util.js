exports.isVideo = (file) =>
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("video") > -1
    ? "videos"
    : null;

exports.isImage = (file) =>
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("image") > -1
    ? "images"
    : null;

exports.isPDF = (file) =>
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("application/pdf") > -1
    ? "docs"
    : null;

exports.isText = (file) =>
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("text/plain") > -1
    ? "docs"
    : null;

exports.isSvg = (file) =>
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("svg") > -1
    ? "images"
    : null;

exports.isGif = (file) =>
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("gif") > -1
    ? "images"
    : null;

exports.isPNG = (file) =>
  this.isImage(file) &&
  String(file.mimetype || "")
    .toLowerCase()
    .indexOf("png") > -1
    ? "images"
    : null;
