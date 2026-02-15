const { getPid, getCsrfToken, getPorts } = require('./discovery');
const { probePorts } = require('./api');
const { render } = require('./ui');

async function run() {
  try {
    const pid = await getPid();
    if (!pid) {
      console.error('❌ Error: Antigravity is not running.');
      process.exit(1);
    }

    const csrfToken = await getCsrfToken(pid);
    if (!csrfToken) {
      console.error('❌ Error: Could not find CSRF token.');
      process.exit(1);
    }

    const ports = await getPorts(pid);
    if (ports.length === 0) {
      console.error('❌ Error: Could not find any listening ports. Type a character in the IDE to wake up the server.');
      process.exit(1);
    }

    const result = await probePorts(ports, csrfToken);
    if (!result) {
      console.error('❌ Error: Could not get a valid response. Type a character in the IDE to wake up the server.');
      process.exit(1);
    }

    render(result.data, result.port);
  } catch (error) {
    console.error('❌ An unexpected error occurred:', error.message);
    process.exit(1);
  }
}

module.exports = {
  run,
};
