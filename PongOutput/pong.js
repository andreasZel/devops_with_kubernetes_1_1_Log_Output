#!/usr/bin/env node
const http = require("http");
// const fs = require("fs");
// const path = require('path');
// var counter = 0;
var logString = '';
require('dotenv').config();
const { Pool } = require('pg');

// const logPath = path.join(__dirname, 'logs', 'counter.txt');   

async function dbInitAndConnect() {
    var client = null;

    console.log('Connecting to db');

    try {
        client = new Pool({
            host: process.env.POSTGRES_HOST,
            port: process.env.POSTGRES_PORT,
            user: process.env.POSTGRES_USER,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB,
        })


    } catch (e) {
        console.log('Error Connecting to db: ', e)
        return null;
    }

    try {
        await client.query(` CREATE TABLE IF NOT EXISTS pingcounter (
        id BIGSERIAL PRIMARY KEY,
        counter INT
      )`);

        console.log("✅ Table pingcounter check/creation complete.");
    } catch (err) {
        console.error("❌ Error creating pingcounter:", err);
    }

    return client;
}

const dbpool = await dbInitAndConnect();

const server = http.createServer(async (req, res) => {

    if (req?.method === 'GET' && req.url === '/pingpong') {
        try {
            const pingsDbResult = await dbpool.query(`SELECT counter from pingcounter`);

            if (pingsDbResult?.rows?.length === 0) {
                res.write(`No pong yet`);
                await dbpool.query(`INSERT INTO pingcounter(counter) VALUES($1)`, [1]);
            } else {
                const counter = pingsDbResult.rows[0]?.counter;
                res.write(`pong ${pingsDbResult.rows[0]?.counter}`);
                await dbpool.query(`UPDATE pingcounter SET counter = $1`, [(counter + 1)]);
            }

            // fs.writeFile(logPath, logString, 'utf8', (err) => {
            //     if (err) {
            //         console.error('Error writing file:', err);
            //         return;
            //     }
            //     console.log(`File written successfully in ${logPath}!`);
            // });

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        } catch (e) {
            console.log(e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(`Error saving counter`);
            res.end("Error reading counter");
        }

    } else if (req?.method === 'GET' && req.url === '/pings') {

        try {
            const pingsDbResult = await dbpool.query(`SELECT counter from pingcounter`);
            if (pingsDbResult?.rows?.length === 0) {
                res.write(`No Ping / Pongs yet`);
            } else {
                const counter = pingsDbResult.rows[0]?.counter;
                logString = `Ping / Pongs: ${counter}`;
                res.write(logString);
            }
            
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end();
        } catch (e) {
            console.log(e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(`Error saving counter`);
            res.end("Error reading counter");
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3003, () => {
    console.log('Started Server on Port 3003');
})

