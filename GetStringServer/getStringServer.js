#!/usr/bin/env node
const http = require("http");
const fs = require("node:fs/promises");
const path = require('path');

const logPath = path.join(__dirname, 'logs', 'text.logs');
const logCounterPath = path.join(__dirname, 'logs', 'counter.txt');

const server = http.createServer(async (req, res) => {

    if (req.url === '/getString') {
        try {
            res.writeHead(200, { 'Content-Type': 'text/plain' });

            const result = await fs.readFile(logPath, 'utf8');
            const resultCounter = await fs.readFile(logCounterPath, 'utf8');

            res.write(`${result}.\nPing / Pongs:${resultCounter}`);
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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Started Server on Port ${PORT}`);
})

