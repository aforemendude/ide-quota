const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[90m',
  green: '\x1b[32m',
  yellow: '\x1b[93m',
  red: '\x1b[31m',
  cyan: '\x1b[34m',
  white: '\x1b[0m',
  magenta: '\x1b[35m',
};

const box = {
  hBar: '─',
  vBar: '│',
  topL: '╭',
  topR: '╮',
  botL: '╰',
  botR: '╯',
  midL: '├',
  midR: '┤',
};

function stripAnsi(s) {
  return s.replace(/\x1b\[[0-9;]*m/g, '');
}

function pad(str, len) {
  return str + ' '.repeat(Math.max(0, len - str.length));
}

function formatModelData(status) {
  const modelConfigs = status.cascadeModelConfigData?.clientModelConfigs || [];
  return modelConfigs
    .filter((c) => c.quotaInfo)
    .map((config) => {
      const pct = Math.round(config.quotaInfo.remainingFraction * 100);
      const resetDate = new Date(config.quotaInfo.resetTime);
      const diffMs = Math.max(0, resetDate - Date.now());
      const diffMin = Math.round(diffMs / 60000);
      const days = Math.floor(diffMin / 1440);
      const hours = Math.floor((diffMin % 1440) / 60);
      const mins = diffMin % 60;
      const resetTime = `${days}d ${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m`;
      return { name: config.label, pct, resetTime };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = {
  colors,
  box,
  stripAnsi,
  pad,
  formatModelData,
};
