const path = require("path");
const fs = require("fs");

const readableStream = new fs.ReadStream(path.join(__dirname, "text.txt"));
readableStream.on("data", (data) => console.log(data.toString()));
