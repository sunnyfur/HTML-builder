const path = require("path");
const { readdir } = require("fs/promises");
const fs = require("fs");

const mergeStyles = async () => {
  const pathFrom = path.join(__dirname, "styles");
  const pathTo = path.join(__dirname, "project-dist");
  const fileOutput = fs.createWriteStream(path.join(pathTo, "bundle.css"));

  try {
    const files = await readdir(pathFrom, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) == ".css") {
        try {
          const readableStream = fs.createReadStream(
            path.join(pathFrom, file.name)
          );
          readableStream.on("data", (data) => fileOutput.write(data));
        } catch {
          console.log("The file could not be read");
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};
mergeStyles();
