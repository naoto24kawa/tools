import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerEncodeTools } from './tools/encode';
import { registerHashTools } from './tools/hash';
import { registerCryptoTools } from './tools/crypto';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'elchika-tools',
    version: '1.0.0',
  });

  registerEncodeTools(server);
  registerHashTools(server);
  registerCryptoTools(server);

  return server;
}
