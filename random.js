#!/usr/bin/env node
const http = require("http");
const crypto = require("crypto");
const id = crypto.randomBytes(20).toString('hex');

setInterval(() => {
    console.log(`${new Date().toISOString()}: ${id}`)
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

