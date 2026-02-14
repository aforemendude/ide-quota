const { execSync } = require('child_process');

function getPid() {
  const platform = process.platform;
  if (platform === 'win32') {
    try {
      const psOutput = execSync(
        `powershell -Command "Get-Process language_server_windows_x64 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Id"`,
        { windowsHide: true },
      )
        .toString()
        .trim();
      if (psOutput) {
        return psOutput.split(/\s+/)[0];
      }
    } catch {
      return null;
    }
  } else if (platform === 'linux') {
    try {
      const pgrepOutput = execSync('pgrep --full language_server_linux_x64').toString().trim();
      return pgrepOutput.split('\n')[0].trim();
    } catch {
      return null;
    }
  }
  return null;
}

function getToken(pid) {
  const platform = process.platform;
  if (platform === 'win32') {
    try {
      const psOutput = execSync(
        `powershell -Command "(Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}').CommandLine"`,
        {
          windowsHide: true,
        },
      ).toString();
      const tokenMatch = psOutput.match(/--csrf_token\s+([^\s]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    } catch {
      return null;
    }
  } else if (platform === 'linux') {
    try {
      const psOutput = execSync(`ps -f --pid ${pid}`).toString();
      const tokenMatch = psOutput.match(/--csrf_token ([^\s]+)/);
      return tokenMatch ? tokenMatch[1] : null;
    } catch {
      return null;
    }
  }
  return null;
}

function getPorts(pid) {
  const platform = process.platform;
  const ports = [];
  if (platform === 'win32') {
    try {
      const netstatOutput = execSync(`netstat -ano`, { windowsHide: true }).toString();
      const lines = netstatOutput.split('\n');
      for (const line of lines) {
        if (line.includes('LISTENING') && line.includes(pid)) {
          const match = line.match(/127\.0\.0\.1:(\d+)/);
          if (match) {
            ports.push(match[1]);
          }
        }
      }
    } catch {
      // Ignore errors
    }
  } else if (platform === 'linux') {
    try {
      const lsofOutput = execSync(`lsof -n -P -p ${pid}`).toString();
      const lines = lsofOutput.split('\n');
      for (const line of lines) {
        if (line.includes('LISTEN') && line.includes('127.0.0.1:')) {
          const match = line.match(/127\.0\.0\.1:(\d+)/);
          if (match) {
            ports.push(match[1]);
          }
        }
      }
    } catch {
      // Ignore errors
    }
  }
  return ports;
}

module.exports = { getPid, getToken, getPorts };
