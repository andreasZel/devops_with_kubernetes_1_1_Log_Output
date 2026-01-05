#!/usr/bin/env node
import http from 'http';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

dotenv.config();
var logString = '';

const GREETER_URL = process.env.GREETER_URL || 'http://greeter.exercises.sslip.io';

// Helper function to call the greeter service
async function getGreeting() {
    try {
        return new Promise((resolve, reject) => {
            const url = new URL(GREETER_URL);
            http.get(url, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const greeting = JSON.parse(data);
                        resolve(greeting.message);
                    } catch (e) {
                        reject(e);
                    }
                });
            }).on('error', reject);
        });
    } catch (err) {
        console.error('Error calling greeter service:', err.message);
        return 'Greeting service unavailable';
    }
}

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

    if (req?.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("OK");
    } else if (req?.method === 'GET' && req.url === '/healthz') {
        try {
            if (!dbpool) {
                console.error("Database pool not initialized");
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Database not available");
                return;
            }
            await dbpool.query('SELECT 1');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("OK");
        } catch (err) {
            console.error("Healthcheck DB failed:", err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end("Error connecting to Db");
        }
    } else if (req?.method === 'GET' && req.url === '/increasePingPongs') {
        try {
            if (!dbpool) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Database not available");
                return;
            }
            const pingsDbResult = await dbpool.query(`SELECT counter from pingcounter`);
            res.writeHead(200, { 'Content-Type': 'text/plain' });

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

            if (!dbpool) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Database not available");
                return;
            }
            res.end();
        } catch (e) {
            console.log(e);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.write(`Error saving counter`);
            res.end("Error reading counter");
        }

    } else if (req?.method === 'GET' && req.url === '/pings') {

        try {

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            const pingsDbResult = await dbpool.query(`SELECT counter from pingcounter`);
            
            let output = '';
            if (pingsDbResult?.rows?.length === 0) {
                output = `No Ping / Pongs yet`;
            } else {
                const counter = pingsDbResult.rows[0]?.counter;
                output = `Ping / Pongs: ${counter}`;
            }

            // Get greeting from greeter service
            const greeting = await getGreeting();
            output += `\n${greeting}`;
            
            logString = output;
            res.write(logString);

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

const PORT = process.env.SERVER_PORT || 8080;
server.listen(PORT, () => {
    console.log(`Started Server on Port ${PORT}`);
})

