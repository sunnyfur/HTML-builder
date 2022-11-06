const path = require("path");
const {
  rm,
  mkdir,
  readdir,
  copyFile,
  readFile,
  writeFile,
} = require("node:fs/promises");
const fs = require("fs");
const readline = require("node:readline");

const copyDir = async (pathFrom, pathTo) => {
  await rm(pathTo, { force: true, recursive: true });
  await mkdir(pathTo, { recursive: true });

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
        copyDir(path.join(pathFrom, file.name), path.join(pathTo, file.name));
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const mergeStyles = async (pathFrom, pathTo) => {
  const fileOutput = fs.createWriteStream(path.join(pathTo, "style.css"));

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

const buildPage = async () => {
  const pathDist = path.join(__dirname, "project-dist");
  await copyDir(path.join(__dirname, "assets"), path.join(pathDist, "assets"));
  mergeStyles(path.join(__dirname, "styles"), pathDist);
  const componentsPath = path.join(__dirname, "components");
  const fileIndex = path.join(pathDist, "index.html");
  let templContents = (
    await readFile(path.join(__dirname, "template.html"))
  ).toString();

  const replacements = templContents.match(/(?<={{)[a-zA-Z]+(?=}})/g);
  for await (repl of replacements) {
    try {
      const newres = await readFile(path.join(componentsPath, repl + ".html"));
      templContents = templContents.replaceAll(
        `{{${repl}}}`,
        newres.toString()
      );
    } catch (err) {
      console.log(err);
    }
  }
  writeFile(fileIndex, templContents);
};

buildPage();
