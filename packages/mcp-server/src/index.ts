import { Hono } from 'hono';
import { toReqRes, toFetchResponse } from 'fetch-to-node';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpServer } from './mcp';

const app = new Hono();

const MAX_BODY_SIZE = 1024 * 1024;

app.post('/mcp', async (c) => {
  const contentLength = Number(c.req.header('content-length') || 0);
  if (contentLength > MAX_BODY_SIZE) {
    return c.json({ error: 'Request body too large' }, 413);
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON in request body' }, 400);
  }

  try {
    // Stateless mode: create fresh server per request (no session state)
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    await server.connect(transport);

    const { req, res } = toReqRes(c.req.raw);
    await transport.handleRequest(req, res, body);
    return toFetchResponse(res);
  } catch (e) {
    console.error('[mcp-server] MCP request handling failed:', e);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/mcp', async (c) => {
  c.header('Allow', 'POST');
  return c.text('SSE not supported in stateless mode', 405);
});

app.delete('/mcp', async (c) => {
  // Stateless mode: no sessions to terminate
  c.header('Allow', 'POST');
  return c.text('Session termination not supported in stateless mode', 405);
});

app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
