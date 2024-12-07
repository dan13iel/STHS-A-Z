const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  if (req.url=="/"){
    req.url = "/index.html"
  }
  const filePath = './web' + req.url;
  console.log(req.url)

  fs.readFile(filePath, (err, data) => {
    
    if (err) {
      res.statusCode = 500;
      res.end('Error: ' + err.message);
    } else {
      if (req.url.endsWith(".js")){
        res.setHeader("content-type", "text/javascript");
      }
      res.statusCode = 200;
      res.write(data);
      res.end();
    }
  });
}).listen(80, () => {
  console.log('Server running on http://localhost:80/');
});