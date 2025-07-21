#!/usr/bin/env node
const crypto = require("crypto");
const fs = require("fs");
const path = require('path');
const id = crypto.randomBytes(20).toString('hex');
var logString = '';

const logPath = path.join(__dirname, 'logs', 'text.logs');        

setInterval(() => {
    try {
        logString = `${new Date().toISOString()}: ${id}`;

        fs.writeFile(logPath, logString, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log(`File written successfully in ${logPath}!`);
        });
    } catch(e) {
        console.log(e);
    }
}, 5e3);

