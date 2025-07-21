#!/usr/bin/env node
const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const id = crypto.randomBytes(20).toString('hex');
var logString = '';

setInterval(() => {
    try {
        logString = `${new Date().toISOString()}: ${id}`;

        fs.writeFile('./text.logs', logString, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('File written successfully!');
        });
    } catch(e) {
        console.log(e);
    }
}, 5e3);

const server = http.createServer((req, res) => {

    if (req.url === '/status') {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Transfer-Encoding': 'chunked',
        });

        res.write(`
      <html>
        <head><title>Progress:</title></head>
        <body>
          <h1>Progress:</h1>
          <div id="progress">${new Date().toISOString()}: ${id}</div>
        </body>
      </html>
    `);
        res.end();
    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Started Server on Port 3000');
})

