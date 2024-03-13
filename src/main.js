const express = require("express");
const morgan = require("morgan");

const app = express();
const port = process.env.PORT || "3001";
const bodyParser = require("body-parser");
const connectMongoDB = require("./database/connectMongoDB");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const socket = require("./socket");
app.use(
  cors({
    origin: [/localhost/, /docker-pratice-production.up.railway.app/],
  })
);

app.use(bodyParser.json());
app.use(morgan("common"));
app.use(cookieParser());
//routes
app.get("/v1/health-check", (req, res) => res.send("ok"));
app.use("/v1", require("./routes/v1/index"));

async function main() {
  await connectMongoDB();

  try {
    socket(io);
  } catch (error) {
    throw new Error(error);
  }
  http.listen(port, (er) => {
    if (er) {
      console.log("ERROR listen server", er);
      process.exit(1);
    } else {
      console.log("Your server is listening on :", port);
      require("./boostrap")();
    }
  });
}

module.exports = main;
