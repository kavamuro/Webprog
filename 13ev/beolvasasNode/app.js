import fs from "fs";

fs.readFile("CNtunnels.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }
  const formatted = data.replaceAll(";", " | ");
  console.log("File content:", formatted);
});
