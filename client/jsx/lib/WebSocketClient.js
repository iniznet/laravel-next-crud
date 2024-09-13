import { io } from 'socket.io-client';
class WebSocketClient {
    constructor() {
        this.socket = null;
        this.listeners = {};
        this.reconnectInterval = 1000;
        this.maxReconnectAttempts = 5;
        this.reconnectAttempts = 0;
        this.handleConnect = () => {
            console.log('WebSocket connected');
            this.reconnectAttempts = 0;
        };
        this.handleDisconnect = () => {
            console.log('WebSocket disconnected');
            this.reconnect();
        };
        this.handleError = (error) => {
            console.error('WebSocket error:', error);
            this.socket?.close();
            this.reconnect();
        };
        this.connect();
    }
    connect() {
        if (typeof window === 'undefined')
            return; // Don't connect on server-side
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
            this.socket?.on(event, (data) => this.notifyListeners(event, data));
        });
    }
    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => this.connect(), this.reconnectInterval);
        }
        else {
            console.error('Max reconnection attempts reached. Please refresh the page.');
        }
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = new Set();
            this.socket?.on(event, (data) => this.notifyListeners(event, data));
        }
        this.listeners[event].add(callback);
    }
    off(event, callback) {
        this.listeners[event]?.delete(callback);
        if (this.listeners[event]?.size === 0) {
            delete this.listeners[event];
            this.socket?.off(event);
        }
    }
    notifyListeners(event, data) {
        console.log(`Received event: ${event}`, data);
        this.listeners[event]?.forEach(callback => callback(data));
    }
    emit(event, data) {
        if (this.socket?.connected) {
            console.log(`Emitting event: ${event}`, data);
            this.socket.emit(event, data);
        }
        else {
            console.warn('Socket is not connected. Unable to emit event:', event);
        }
    }
}
const webSocketClient = new WebSocketClient();
export default webSocketClient;
