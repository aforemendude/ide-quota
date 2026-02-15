const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

async function getPid() {
  const platform = process.platform;
  let output;
  if (platform === 'win32') {
    try {
      const { stdout } = await execAsync(
        `powershell -Command "Get-Process language_server_windows_x64 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"`,
        { windowsHide: true },
      );
      output = stdout.toString().trim();
    } catch {
      return null;
    }
  } else if (platform === 'linux') {
    try {
      const { stdout } = await execAsync('pgrep --full language_server_linux_x64');
      output = stdout.toString().trim();
    } catch {
      return null;
    }
  } else {
    throw new Error('Platform not supported');
  }
  return output.split('\n')[0].trim();
}

async function getToken(pid) {
  const platform = process.platform;
  let output;
  if (platform === 'win32') {
    try {
      const { stdout } = await execAsync(
        `powershell -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`,
        {
          windowsHide: true,
        },
      );
      output = stdout.toString();
    } catch {
      return null;
    }
  } else if (platform === 'linux') {
    try {
      const { stdout } = await execAsync(`ps -f --pid ${pid}`);
      output = stdout.toString();
    } catch {
      return null;
    }
  } else {
    throw new Error('Platform not supported');
  }
  const tokenMatch = output.match(/--csrf_token ([^\s]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

async function getPorts(pid) {
  const platform = process.platform;
  const ports = [];
  if (platform === 'win32') {
    try {
      const { stdout } = await execAsync(`netstat -ano`, { windowsHide: true });
      const lines = stdout.toString().split('\n');
      for (const line of lines) {
        if (line.includes('LISTENING') && line.includes(pid)) {
          const match = line.match(/127\.0\.0\.1:(\d+)/);
          if (match) {
            ports.push(match[1]);
          }
        }
      }
    } catch {}
  } else if (platform === 'linux') {
    try {
      const { stdout } = await execAsync(`lsof -n -P -p ${pid}`);
      const lines = stdout.toString().split('\n');
      for (const line of lines) {
        if (line.includes('LISTEN') && line.includes('127.0.0.1:')) {
          const match = line.match(/127\.0\.0\.1:(\d+)/);
          if (match) {
            ports.push(match[1]);
          }
        }
      }
    } catch {}
  }
  return ports;
}

module.exports = { getPid, getToken, getPorts };
