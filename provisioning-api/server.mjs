import http from 'node:http';
import { Buffer } from 'node:buffer';
import { URL } from 'node:url';

const config = {
  port: Number(process.env.PORT ?? 3000),
  supabaseUrl: required('SUPABASE_URL').replace(/\/$/, ''),
  supabaseAnonKey: required('SUPABASE_ANON_KEY'),
  supabaseSecretKey: required('SUPABASE_SECRET_KEY'),
  wgEasyUrl: required('WGEASY_URL').replace(/\/$/, ''),
  wgEasyUsername: required('WGEASY_USERNAME'),
  wgEasyPassword: required('WGEASY_PASSWORD'),
  allowedOrigins: new Set(
    required('ALLOWED_ORIGINS')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ),
};

const basicAuth = `Basic ${Buffer.from(
  `${config.wgEasyUsername}:${config.wgEasyPassword}`,
).toString('base64')}`;

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url ?? '/', 'http://localhost');
  const origin = request.headers.origin;

  setSecurityHeaders(response);

  if (origin && !config.allowedOrigins.has(origin)) {
    return sendJson(response, 403, { error: 'Origin not allowed' });
  }

  if (origin) {
    response.setHeader('Access-Control-Allow-Origin', origin);
    response.setHeader('Vary', 'Origin');
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Max-Age': '600',
    });
    return response.end();
  }

  try {
    if (request.method === 'GET' && requestUrl.pathname === '/health') {
      return sendJson(response, 200, { status: 'ok' });
    }

    const match = requestUrl.pathname.match(
      /^\/v1\/devices\/([0-9a-f-]{36})\/(provision|configuration|qrcode\.svg)$/,
    );

    if (!match) {
      return sendJson(response, 404, { error: 'Not found' });
    }

    const [, deviceId, action] = match;
    const accessToken = bearerToken(request);
    const user = await authenticateUser(accessToken);
    const device = await getOwnedDevice(deviceId, user.id);

    if (!device) {
      return sendJson(response, 404, { error: 'Device not found' });
    }

    if (action === 'provision' && request.method === 'POST') {
      const provisioned = await provisionDevice(device);
      return sendJson(response, 200, {
        id: provisioned.id,
        name: provisioned.name,
        status: provisioned.status,
        ipv4_address: provisioned.ipv4_address,
        ipv6_address: provisioned.ipv6_address,
      });
    }

    if (action === 'configuration' && request.method === 'GET') {
      return await proxyArtifact(response, device, 'configuration');
    }

    if (action === 'qrcode.svg' && request.method === 'GET') {
      return await proxyArtifact(response, device, 'qrcode.svg');
    }

    return sendJson(response, 405, { error: 'Method not allowed' });
  } catch (error) {
    const status = Number(error.statusCode) || 500;
    const publicMessage = status >= 500 ? 'Provisioning service error' : error.message;
    console.error(new Date().toISOString(), error);
    return sendJson(response, status, { error: publicMessage });
  }
});

server.listen(config.port, '0.0.0.0', () => {
  console.log(`VPNMaster provisioning API listening on :${config.port}`);
});

async function authenticateUser(accessToken) {
  const response = await fetch(`${config.supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: config.supabaseAnonKey,
      authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw httpError(401, 'Invalid or expired session');
  }

  return response.json();
}

async function getOwnedDevice(deviceId, userId) {
  const query = new URLSearchParams({
    id: `eq.${deviceId}`,
    user_id: `eq.${userId}`,
    select: 'id,user_id,name,status,wg_client_id,ipv4_address,ipv6_address',
  });
  const response = await supabaseAdmin(`/rest/v1/devices?${query}`);

  if (!response.ok) {
    throw new Error(`Device lookup failed (${response.status})`);
  }

  const devices = await response.json();
  return devices[0] ?? null;
}

async function provisionDevice(device) {
  if (device.wg_client_id) {
    return device;
  }

  await updateDevice(device.id, { status: 'provisioning', provisioning_error: null });

  const peerName = `vpnmaster-${device.id.slice(0, 8)}`;

  try {
    const clients = await listWgClients();
    let client = clients.find((candidate) => candidate.name === peerName);

    if (!client) {
      const createResponse = await wgEasy('/api/client', {
        method: 'POST',
        body: JSON.stringify({ name: peerName, expiresAt: null }),
      });

      if (!createResponse.ok) {
        throw new Error(`wg-easy create failed (${createResponse.status})`);
      }

      const created = await createResponse.json();
      const refreshedClients = await listWgClients();
      client = refreshedClients.find(
        (candidate) => candidate.id === created.clientId,
      );
    }

    if (!client) {
      throw new Error('Created WireGuard client was not found');
    }

    return updateDevice(device.id, {
      status: 'active',
      wg_client_id: client.id,
      ipv4_address: client.ipv4Address,
      ipv6_address: client.ipv6Address,
      provisioned_at: new Date().toISOString(),
      provisioning_error: null,
    });
  } catch (error) {
    await updateDevice(device.id, {
      status: 'error',
      provisioning_error: String(error.message ?? error).slice(0, 500),
    });
    throw error;
  }
}

async function proxyArtifact(response, device, artifact) {
  if (device.status !== 'active' || !device.wg_client_id) {
    throw httpError(409, 'Device is not active');
  }

  const upstream = await wgEasy(
    `/api/client/${device.wg_client_id}/${artifact}`,
  );

  if (!upstream.ok) {
    throw new Error(`wg-easy artifact request failed (${upstream.status})`);
  }

  const body = Buffer.from(await upstream.arrayBuffer());
  const isQr = artifact === 'qrcode.svg';
  const safeName = device.name
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-|-$/g, '') || 'vpnmaster-device';

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Disposition': isQr
      ? `inline; filename="${safeName}-qr.svg"`
      : `attachment; filename="${safeName}.conf"`,
    'Content-Length': body.length,
    'Content-Type': isQr ? 'image/svg+xml' : 'application/octet-stream',
  });
  response.end(body);
}

async function listWgClients() {
  const response = await wgEasy('/api/client');

  if (!response.ok) {
    throw new Error(`wg-easy list failed (${response.status})`);
  }

  return response.json();
}

function wgEasy(path, options = {}) {
  return fetch(`${config.wgEasyUrl}${path}`, {
    ...options,
    headers: {
      authorization: basicAuth,
      'content-type': 'application/json',
      ...options.headers,
    },
  });
}

async function updateDevice(deviceId, values) {
  const response = await supabaseAdmin(
    `/rest/v1/devices?id=eq.${encodeURIComponent(deviceId)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(values),
    },
  );

  if (!response.ok) {
    throw new Error(`Device update failed (${response.status})`);
  }

  const devices = await response.json();
  return devices[0];
}

function supabaseAdmin(path, options = {}) {
  return fetch(`${config.supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: config.supabaseSecretKey,
      authorization: `Bearer ${config.supabaseSecretKey}`,
      'content-type': 'application/json',
      ...options.headers,
    },
  });
}

function bearerToken(request) {
  const header = request.headers.authorization ?? '';

  if (!header.startsWith('Bearer ') || header.length <= 7) {
    throw httpError(401, 'Authentication required');
  }

  return header.slice(7);
}

function sendJson(response, status, value) {
  const body = JSON.stringify(value);
  response.writeHead(status, {
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(body);
}

function setSecurityHeaders(response) {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'no-referrer');
}

function required(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function httpError(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}
