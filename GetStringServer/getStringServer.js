#!/usr/bin/env node
const http = require("http");
const fs = require("node:fs/promises");
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'text.logs');

const server = http.createServer(async (req, res) => {

    if (req.url === '/getString') {
        try {
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            const result = await fs.readFile(logPath, 'utf8');

            res.write(result);
            res.end();
        } catch (e) {
            console.log(e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Error reading file");
        }
    } else {

        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Started Server on Port 3000');
})

