const path = require("path");
const { mkdir } = require("node:fs/promises");
const { copyFile, constants } = require("node:fs/promises");
const { readdir } = require("fs/promises");

const copyDir = async (pathFrom) => {
  const pathTo = pathFrom + "-copy";
  const createDir = await mkdir(pathTo, { recursive: true });
  try {
    const files = await readdir(pathFrom, {
      withFileTypes: true,
    });
    for (const file of files) {
      if (file.isFile()) {
        try {
          await copyFile(
            path.join(pathFrom, file.name),
            path.join(pathTo, file.name)
          );
        } catch {
          console.log("The file could not be copied");
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
};
copyDir(path.join(__dirname, "files"));
