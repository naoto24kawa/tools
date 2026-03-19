import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: 'elchika-tools',
    version: '1.0.0',
  });

  return server;
}
