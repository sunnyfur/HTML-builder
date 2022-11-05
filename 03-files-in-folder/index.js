const path = require("path");
const { readdir } = require("fs/promises");
const { stat } = require("node:fs");
const { extname } = require("path");

const readFiles = async () => {
  const folder = path.join(__dirname, "secret-folder");
  try {
    const files = await readdir(folder, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        const pathFile = path.join(folder, file.name);
        const extension = path.extname(pathFile);
        const fileName = path.basename(pathFile, extension);
        stat(pathFile, (err, stats) =>
          console.log(
            `${fileName}-${extension.replace(".", "")}-${stats.size} bytes`
          )
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
};
readFiles();
