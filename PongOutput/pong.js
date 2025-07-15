#!/usr/bin/env node
const http = require("http");
var counter = 0;

const server = http.createServer((req, res) => {

    if (req?.method === 'GET' && req.url === '/pingpong') {

        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.write(`pong ${counter}`);
        counter++;
        
        res.end();
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3003, () => {
    console.log('Started Server on Port 3003');
})

