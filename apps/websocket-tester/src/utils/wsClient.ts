export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';
export type MessageDirection = 'sent' | 'received' | 'system';

export interface WsMessage {
  id: string;
  direction: MessageDirection;
  content: string;
  timestamp: Date;
}

export function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
  });
}

export function isValidWsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'ws:' || parsed.protocol === 'wss:';
  } catch {
    return false;
  }
}

export function createSystemMessage(content: string): WsMessage {
  return {
    id: generateMessageId(),
    direction: 'system',
    content,
    timestamp: new Date(),
  };
}

export function createSentMessage(content: string): WsMessage {
  return {
    id: generateMessageId(),
    direction: 'sent',
    content,
    timestamp: new Date(),
  };
}

export function createReceivedMessage(content: string): WsMessage {
  return {
    id: generateMessageId(),
    direction: 'received',
    content,
    timestamp: new Date(),
  };
}

export interface WsClientCallbacks {
  onOpen: () => void;
  onMessage: (data: string) => void;
  onClose: (code: number, reason: string) => void;
  onError: () => void;
}

export function createWsConnection(
  url: string,
  callbacks: WsClientCallbacks,
): WebSocket {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    callbacks.onOpen();
  };

  ws.onmessage = (event) => {
    const data = typeof event.data === 'string' ? event.data : String(event.data);
    callbacks.onMessage(data);
  };

  ws.onclose = (event) => {
    callbacks.onClose(event.code, event.reason);
  };

  ws.onerror = () => {
    callbacks.onError();
  };

  return ws;
}
