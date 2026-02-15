const { colors, box, stripAnsi, pad, formatModelData } = require('./formatter');

function makeBar(pct, width = 20) {
  const filled = Math.round((pct / 100) * width);
  const empty = width - filled;
  const color = pct >= 70 ? colors.green : pct >= 30 ? colors.yellow : colors.red;
  return `${color}${'█'.repeat(filled)}${colors.dim}${'░'.repeat(empty)}${colors.reset}`;
}

function render(finalJson, activePort) {
  const status = finalJson.userStatus;
  const models = formatModelData(status);

  const nameWidth = Math.max(5, ...models.map((m) => m.name.length));
  const barWidth = 20;
  const resetWidth = 10;
  const innerWidth = nameWidth + barWidth + 12 + resetWidth;

  const rule = box.hBar.repeat(innerWidth);

  const padLine = (content) => {
    const visible = stripAnsi(content).length;
    const padding = Math.max(0, innerWidth - visible);
    return `${colors.dim}${box.vBar}${colors.reset}${content}${' '.repeat(padding)}${colors.dim}${box.vBar}${colors.reset}`;
  };

  const planStr = `Plan: ${status.planStatus.planInfo.planName}`;
  const portStr = `Port: ${activePort}`;
  const planPortGap = Math.max(1, innerWidth - planStr.length - portStr.length - 2);

  console.log(`${colors.dim}${box.topL}${rule}${box.topR}${colors.reset}`);
  console.log(padLine(` ${colors.bold}${colors.cyan}${status.name}${colors.reset}`));
  console.log(padLine(` ${colors.dim}${status.email}${colors.reset}`));
  console.log(
    padLine(
      ` ${colors.magenta}${planStr}${colors.reset}${' '.repeat(planPortGap)}${colors.dim}${portStr}${colors.reset} `,
    ),
  );
  console.log(`${colors.dim}${box.midL}${rule}${box.midR}${colors.reset}`);

  // Column header
  console.log(
    padLine(
      ` ${colors.bold}${pad('Model', nameWidth)}  ${pad('Quota', barWidth + 5)}  ${pad('Reset', resetWidth)}${colors.reset}`,
    ),
  );
  console.log(`${colors.dim}${box.midL}${rule}${box.midR}${colors.reset}`);

  // Model rows
  for (const m of models) {
    const pctStr = `${m.pct}%`.padStart(4);
    const color = m.pct >= 70 ? colors.green : m.pct >= 30 ? colors.yellow : colors.red;
    console.log(
      padLine(
        ` ${colors.white}${pad(m.name, nameWidth)}${colors.reset}  ${makeBar(m.pct, barWidth)} ${color}${pctStr}${colors.reset}  ${colors.dim}${pad(m.resetTime, resetWidth)}${colors.reset}`,
      ),
    );
  }

  // Footer
  console.log(`${colors.dim}${box.botL}${rule}${box.botR}${colors.reset}`);
}

module.exports = {
  render,
};
