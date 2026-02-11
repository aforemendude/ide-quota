#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

const platform = process.platform;
let script;

if (platform === 'win32') {
  script = 'ag-quota-windows.js';
} else if (platform === 'linux') {
  script = 'ag-quota-linux.js';
} else {
  console.error(`❌ Error: Unsupported platform "${platform}". Only Windows and Linux are supported.`);
  process.exit(1);
}

// Implementations are in the same directory
const scriptPath = path.join(__dirname, script);

const child = spawn('node', [scriptPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error(`❌ Error: Failed to start the quota script: ${err.message}`);
  process.exit(1);
});
