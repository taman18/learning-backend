const http = require("http");
const fs = require("fs");

const myServer = http.createServer((req, res) => {
  if (req.url === "/favicon.ico") {
    res.end();
    return;
  }
  fs.appendFile(
    "./files/logs.txt",
    `Request received at ${new Date()} with path ${req.url}\n`,
    (err) => {
      if (err) {
        console.log(err);
      }
      switch (req.url) {
        case "/":
          res.end("Home Page");
          break;
        case "/about-us":
          res.end("About Us Page");
          break;
        case "/contact-us":
          res.end("Contact Us Page");
          break;
        case "/get-all-logs":
          fs.readFile("./files/logs.txt", "utf-8", (err, data) => {
            if (err) {
              console.log(err);
              res.end("Error reading logs");
            } else {
              res.end(data);
            }
          });
          break;
        default:
          res.end("Page Not Found");
      }
    },
  );
});

myServer.listen(8000, () => {
  console.log("Server is running on port 8000");
});
