#!/usr/bin/env node

const { execSync } = require("child_process");

const main = async () => {
  try {
    // 1. Find the Language Server process PID
    let pid;
    try {
      const pgrepOutput = execSync("pgrep --full language_server_linux_x64").toString().trim();
      pid = pgrepOutput.split("\n")[0].trim();
    } catch {
      // Error handled below
    }
    if (!pid) {
      console.error("❌ Error: Antigravity is not running.");
      process.exit(1);
    }

    // 2. Extract Token
    let token;
    try {
      const psOutput = execSync(`ps -f --pid ${pid}`).toString();
      const tokenMatch = psOutput.match(/--csrf_token ([^\s]+)/);
      if (tokenMatch) {
        token = tokenMatch[1];
      }
    } catch {
      // Error handled below
    }
    if (!token) {
      console.error("❌ Error: Could not find CSRF token.");
      process.exit(1);
    }

    // 3. Find active API Ports
    let ports = [];
    try {
      const lsofOutput = execSync(`lsof -n -P -p ${pid}`).toString();
      const lines = lsofOutput.split("\n");
      for (const line of lines) {
        if (line.includes("LISTEN") && line.includes("127.0.0.1:")) {
          const match = line.match(/127\.0\.0\.1:(\d+)/);
          if (match) {
            ports.push(match[1]);
          }
        }
      }
    } catch {
      // Error handled below
    }
    if (ports.length === 0) {
      console.error("❌ Error: Could not find any listening ports. Type a character in the IDE to wake up the server.");
      process.exit(1);
    }

    // 4. Probe ports
    let finalJson = null;
    let activePort = null;
    for (const port of ports) {
      try {
        const response = await fetch(
          `http://127.0.0.1:${port}/exa.language_server_pb.LanguageServerService/GetUserStatus`,
          {
            method: "POST",
            headers: {
              "Connect-Protocol-Version": "1",
              "Content-Type": "application/json",
              "X-Codeium-Csrf-Token": token,
            },
            body: JSON.stringify({
              metadata: {
                ideName: "antigravity",
              },
            }),
          },
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.userStatus) {
            finalJson = data;
            activePort = port;
            break;
          }
        }
      } catch {
        // Request failed, try the next port
      }
    }
    if (!finalJson) {
      console.error("❌ Error: Could not get a valid response. Type a character in the IDE to 'wake up' the server.");
      process.exit(1);
    }

    // 5. Output results
    const status = finalJson.userStatus;
    const planInfo = status.planStatus?.planInfo || {};

    // Colors
    const reset = "\x1b[0m";
    const bold = "\x1b[1m";
    const dim = "\x1b[2m";
    const green = "\x1b[32m";
    const yellow = "\x1b[33m";
    const red = "\x1b[31m";
    const cyan = "\x1b[36m";
    const white = "\x1b[37m";
    const magenta = "\x1b[35m";

    // Gather and sort model data
    const modelConfigs = status.cascadeModelConfigData?.clientModelConfigs || [];
    const models = modelConfigs
      .filter((c) => c.quotaInfo)
      .map((config) => {
        const pct = Math.round(config.quotaInfo.remainingFraction * 100);
        const resetDate = new Date(config.quotaInfo.resetTime);
        const diffMs = Math.max(0, resetDate - Date.now());
        const diffMin = Math.round(diffMs / 60000);
        const days = Math.floor(diffMin / 1440);
        const hours = Math.floor((diffMin % 1440) / 60);
        const mins = diffMin % 60;
        const resetTime = `${days}d ${String(hours).padStart(2, "0")}h ${String(mins).padStart(2, "0")}m`;
        return { name: config.label, pct, resetTime };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    // Calculate column widths
    const nameWidth = Math.max(5, ...models.map((m) => m.name.length));
    const barWidth = 20;

    // Build quota bar
    const makeBar = (pct) => {
      const filled = Math.round((pct / 100) * barWidth);
      const empty = barWidth - filled;
      const color = pct >= 70 ? green : pct >= 30 ? yellow : red;
      return `${color}${"█".repeat(filled)}${dim}${"░".repeat(empty)}${reset}`;
    };

    // Box drawing
    const hBar = "─";
    const vBar = "│";

    const resetWidth = 10;
    const innerWidth = nameWidth + barWidth + 12 + resetWidth;
    const rule = hBar.repeat(innerWidth);
    const pad = (str, len) => str + " ".repeat(Math.max(0, len - str.length));
    const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, "");
    const padLine = (content) => {
      const visible = stripAnsi(content).length;
      const padding = Math.max(0, innerWidth - visible);
      return `${dim}${vBar}${reset}${content}${" ".repeat(padding)}${dim}${vBar}${reset}`;
    };

    // Header
    const planStr = `Plan: ${planInfo.planName || "N/A"}`;
    const portStr = `Port: ${activePort}`;
    const planPortGap = Math.max(1, innerWidth - planStr.length - portStr.length - 2);

    console.log(`${dim}╭${rule}╮${reset}`);
    console.log(padLine(` ${bold}${cyan}${status.name || "N/A"}${reset}`));
    console.log(padLine(` ${dim}${status.email}${reset}`));
    console.log(padLine(` ${magenta}${planStr}${reset}${" ".repeat(planPortGap)}${dim}${portStr}${reset} `));
    console.log(`${dim}├${rule}┤${reset}`);

    // Column header
    console.log(
      padLine(` ${bold}${pad("Model", nameWidth)}  ${pad("Quota", barWidth + 5)}  ${pad("Reset", resetWidth)}${reset}`),
    );
    console.log(`${dim}├${rule}┤${reset}`);

    // Model rows
    for (const m of models) {
      const pctStr = `${m.pct}%`.padStart(4);
      const color = m.pct >= 70 ? green : m.pct >= 30 ? yellow : red;
      console.log(
        padLine(
          ` ${white}${pad(m.name, nameWidth)}${reset}  ${makeBar(m.pct)} ${color}${pctStr}${reset}  ${dim}${pad(m.resetTime, resetWidth)}${reset}`,
        ),
      );
    }

    // Footer
    console.log(`${dim}╰${rule}╯${reset}`);
  } catch (error) {
    console.error("❌ An unexpected error occurred:", error.message);
    process.exit(1);
  }
};

main();
