const { execSync } = require('child_process');

function getPid() {
  const platform = process.platform;
  let output;
  if (platform === 'win32') {
    try {
      output = execSync(
        `powershell -Command "Get-Process language_server_windows_x64 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"`,
        { windowsHide: true },
      )
        .toString()
        .trim();
    } catch {
      return null;
    }
  } else if (platform === 'linux') {
    try {
      output = execSync('pgrep --full language_server_linux_x64').toString().trim();
    } catch {
      return null;
    }
  } else {
    throw new Error('Platform not supported');
  }
  return output.split('\n')[0].trim();
}

function getToken(pid) {
  const platform = process.platform;
  let output;
  if (platform === 'win32') {
    try {
      output = execSync(
        `powershell -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`,
        {
          windowsHide: true,
        },
      ).toString();
    } catch {
      return null;
    }
  } else if (platform === 'linux') {
    try {
      output = execSync(`ps -f --pid ${pid}`).toString();
    } catch {
      return null;
    }
  } else {
    throw new Error('Platform not supported');
  }
  const tokenMatch = output.match(/--csrf_token ([^\s]+)/);
  return tokenMatch ? tokenMatch[1] : null;
}

function getPorts(pid) {
  const platform = process.platform;
  const ports = [];
  if (platform === 'win32') {
    try {
      const output = execSync(`netstat -ano`, { windowsHide: true }).toString();
      const lines = output.split('\n');
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
      const output = execSync(`lsof -n -P -p ${pid}`).toString();
      const lines = output.split('\n');
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
