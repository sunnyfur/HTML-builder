const path = require("path");
const fs = require("fs");
const readline = require("node:readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const fileOutput = fs.createWriteStream(path.join(__dirname, "text.txt"));

rl.question("Hello!\n", (answer) => {
  fileOutput.write(answer + "\n");
  rl.on("line", (line) => {
    if (line.trim() == "exit") {
      process.exit();
    } else {
      fileOutput.write(line + "\n");
    }
  });
});

process.on("exit", () => {
  console.log("Bye!");
  fileOutput.close();
});
