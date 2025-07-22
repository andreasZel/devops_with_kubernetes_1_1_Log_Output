#!/usr/bin/env node
const http = require("http");
const fs = require("fs");
const path = require('path');
var counter = 0;
var logString = '';

const logPath = path.join(__dirname, 'logs', 'counter.txt');   

const server = http.createServer((req, res) => {

    if (req?.method === 'GET' && req.url === '/pingpong') {
        try {
            logString = `pong ${counter}`;
            counter++;
            
            fs.writeFile(logPath, logString, 'utf8', (err) => {
                if (err) {
                    console.error('Error writing file:', err);
                    return;
                }
                console.log(`File written successfully in ${logPath}!`);
            });

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write(`pong ${counter}`);
            res.end();
        } catch (e) {
            console.log(e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(`Error saving counter`);
            res.end("Error reading file");
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3003, () => {
    console.log('Started Server on Port 3003');
})

