const fs = require("fs");
const path = require("path");
const publicImgDir = path.join(__dirname, "public", "images");
const files = fs.readdirSync(publicImgDir).filter((f) => f.endsWith(".jpeg") || f.endsWith(".jpg"));
let html = '<html><body style="display:flex;flex-wrap:wrap;">';
files.forEach((f) => {
  html +=
    '<div style="width:200px;margin:10px;text-align:center;"><img src="/images/' +
    f +
    '" style="width:100%;height:auto;"/><p style="font-size:12px;word-wrap:break-word;">' +
    f +
    "</p></div>";
});
html += "</body></html>";
fs.writeFileSync(path.join(__dirname, "public", "gallery.html"), html);
console.log("Generated gallery.html");
