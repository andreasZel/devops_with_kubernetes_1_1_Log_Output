#!/usr/bin/env node

const crypto = require("crypto");
const id = crypto.randomBytes(20).toString('hex');

setInterval(() => {
    console.log(`${new Date().toISOString()}: ${id}`)
}, 5e3)