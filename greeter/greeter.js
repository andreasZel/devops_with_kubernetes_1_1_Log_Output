#!/usr/bin/env node

import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const VERSION = process.env.GREETER_VERSION || 'v1';
const PORT = 3004;

const greetings = {
  v1: 'Greeter v1',
  v2: 'Greeter v2'
};

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: greetings[VERSION],
      version: VERSION
    }));
  } else if (req.method === 'GET' && req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('OK');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Greeter ${VERSION} started on port ${PORT}`);
});
