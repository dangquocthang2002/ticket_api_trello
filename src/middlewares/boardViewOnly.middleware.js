const boardViewOnly = (getBoardByCurrentObj) => {
  return async (req, res, next) => {
    try {
      let board = await getBoardByCurrentObj(req);
      if (req.data.role === "ADMIN") {
        req.board = board;
        return next();
      }
      // if (board.viewOnly) {
      //   res.status(403).json({ message: "Just view Board Only" });
      // } else {
      req.board = board;
      next();
      // }
    } catch (error) {
      res.status(403).json({ message: "Just view Board Only" + error });
    }
  };
};
module.exports = boardViewOnly;
