export function textResult(text: string) {
  return { content: [{ type: 'text' as const, text }] };
}

export function errorResult(toolName: string, e: unknown) {
  console.error(`[mcp-server] Tool "${toolName}" failed:`, e);
  return {
    isError: true,
    content: [
      {
        type: 'text' as const,
        text: `Error in ${toolName}: ${e instanceof Error ? e.message : String(e)}`,
      },
    ],
  };
}
