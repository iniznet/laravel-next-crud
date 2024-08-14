import { io, Socket } from 'socket.io-client';

class WebSocketClient {
    private socket: Socket | null = null;
    private listeners: { [event: string]: Set<(data: any) => void> } = {};
    private reconnectInterval: number = 1000;
    private maxReconnectAttempts: number = 5;
    private reconnectAttempts: number = 0;

    constructor() {
        this.connect();
    }

    private connect() {
        if (typeof window === 'undefined') return; // Don't connect on server-side

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = 3001; // Make sure this matches your WebSocket server port
        const url = `${protocol}//${host}:${port}`;

        this.socket = io(url, {
            reconnection: false, // We'll handle reconnection ourselves
            timeout: 10000,
        });

        this.socket.on('connect', this.handleConnect);
        this.socket.on('disconnect', this.handleDisconnect);
        this.socket.on('error', this.handleError);

        // Set up listeners for all registered events
        Object.keys(this.listeners).forEach(event => {
            this.socket?.on(event, (data: any) => this.notifyListeners(event, data));
        });
    }

    private handleConnect = () => {
        console.log('WebSocket connected');
        this.reconnectAttempts = 0;
    };

    private handleDisconnect = () => {
        console.log('WebSocket disconnected');
        this.reconnect();
    };

    private handleError = (error: any) => {
        console.error('WebSocket error:', error);
        this.socket?.close();
        this.reconnect();
    };

    private reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), this.reconnectInterval);
        } else {
            console.error('Max reconnection attempts reached. Please refresh the page.');
        }
    }

    public on(event: string, callback: (data: any) => void) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
            this.socket?.on(event, (data: any) => this.notifyListeners(event, data));
        }
        this.listeners[event].add(callback);
    }

    public off(event: string, callback: (data: any) => void) {
        this.listeners[event]?.delete(callback);
        if (this.listeners[event]?.size === 0) {
            delete this.listeners[event];
            this.socket?.off(event);
        }
    }

    private notifyListeners(event: string, data: any) {
        console.log(`Received event: ${event}`, data);
        this.listeners[event]?.forEach(callback => callback(data));
    }

    public emit(event: string, data: any) {
        if (this.socket?.connected) {
            console.log(`Emitting event: ${event}`, data);
            this.socket.emit(event, data);
        } else {
            console.warn('Socket is not connected. Unable to emit event:', event);
        }
    }
}

const webSocketClient = new WebSocketClient();
export default webSocketClient;