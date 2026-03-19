// Stub for raw-body and content-type Node.js modules.
// MCP SDK imports these but they are not needed in CF Workers
// when using parsedBody argument in transport.handleRequest().
// See: https://github.com/mhart/mcp-hono-stateless
export default function noop() {
  console.warn('[mcp-server] Stubbed Node.js module called - check fetch-to-node compatibility');
}
export const parse = noop;
