const path = require("path");
const { rm, mkdir, readdir, copyFile } = require("node:fs/promises");

const copyDir = async (pathFrom, pathTo) => {
  await rm(pathTo, { force: true, recursive: true });
  await mkdir(pathTo, { recursive: true });

  const copyFiles = async (pathFrom) => {
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
        } else {
          copyFiles(path.join(pathFrom, file.name));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  copyFiles(pathFrom);
};
copyDir(path.join(__dirname, "files"), path.join(__dirname, "files-copy"));
