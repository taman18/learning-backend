const fs = require("fs");

fs.writeFileSync("./files/test.txt", "Hey I am learning Node.js"); //sync way to write file

fs.writeFile("./files/test2.txt", "Hey I am learning Node.js", (err) => { //async way to write file
  if (err) {
    console.log(err);
  } else {
    console.log("File written successfully");
  }
});

const result = fs.readFileSync("./files/contact.txt", "utf-8"); // read file in sync way
console.log(result);

fs.readFile("./files/contact.txt", "utf-8", (err, data) => { // read file in async way
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});
