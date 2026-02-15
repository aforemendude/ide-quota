function isObject(val) {
  return val !== null && typeof val === 'object';
}

async function fetchUserStatus(port, token) {
  try {
    const response = await fetch(
      `http://127.0.0.1:${port}/exa.language_server_pb.LanguageServerService/GetUserStatus`,
      {
        method: 'POST',
        headers: {
          'Connect-Protocol-Version': '1',
          'Content-Type': 'application/json',
          'X-Codeium-Csrf-Token': token,
        },
        body: JSON.stringify({
          metadata: {
            ideName: 'antigravity',
          },
        }),
      },
    );
    if (response.ok) {
      const data = await response.json();
      if (isObject(data) && isObject(data.userStatus)) {
        return data;
      }
    }
  } catch {}
  return null;
}

async function probePorts(ports, csrfToken) {
  for (const port of ports) {
    const data = await fetchUserStatus(port, csrfToken);
    if (data) {
      return {
        data,
        port,
      };
    }
  }
  return null;
}

module.exports = {
  probePorts,
};
