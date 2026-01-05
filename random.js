#!/usr/bin/env node
const crypto = require("crypto");
const http = require("http");
const fs = require("fs/promises");
const path = require('path');
const id = crypto.randomBytes(20).toString('hex');
var logString = '';

const logPath = path.join(__dirname, 'information', 'information.txt');

setInterval(() => {
    try {
        logString = `${new Date().toISOString()}: ${id}`;

        // fs.writeFile(logPath, logString, 'utf8', (err) => {
        //     if (err) {
        //         console.error('Error writing file:', err);
        //         return;
        //     }
        //     console.log(`File written successfully in ${logPath}!`);
        // });
    } catch (e) {
        console.log(e);
    }
}, 5e3);

const server = http.createServer(async (req, res) => {

    if (req?.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("OK");
    } else if (req?.method === 'GET' && req.url.startsWith('/pingpong')) {
        try {
            const pings = await fetch('http://logoutput.exercises.svc.cluster.local/pings');
            const pingsText = await pings.text();
            const infoText = await fs.readFile(logPath, 'utf8');
            var infoMessageParsed = '';
            try {
                const match = infoText.match(/message="([^"]*)"/);
                if (match) infoMessageParsed = match[1];
            } catch (e) {
                console.log(e);
            }

            res.write(`file content: ${infoMessageParsed}.\n${logString}.\n${pingsText}`);

            res.end();
        } catch (e) {
            console.log(e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(`Error returning response`);
            res.end("Error reading file");
        }

    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }

});

const PORT = process.env.SERVER_PORT || 3004;
server.listen(PORT, () => {
    console.log(`Started Server on Port ${PORT}`);
})



