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

  const server = createMcpServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  await server.connect(transport);

  const body = await c.req.json();
  const { req, res } = toReqRes(c.req.raw);
  await transport.handleRequest(req, res, body);
  return toFetchResponse(res);
});

app.get('/mcp', async (c) => {
  c.header('Allow', 'POST');
  return c.text('SSE not supported in stateless mode', 405);
});

app.delete('/mcp', async (c) => {
  return c.json({ ok: true }, 200);
});

app.get('/health', (c) => c.json({ status: 'ok' }));

export default app;
