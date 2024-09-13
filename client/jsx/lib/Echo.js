import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
class EchoClient {
    constructor() {
        this.echo = null;
        if (typeof window !== 'undefined') {
            window.Pusher = Pusher;
            this.echo = new Echo({
                broadcaster: 'pusher',
                key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
                cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
                wsHost: process.env.NEXT_PUBLIC_WEBSOCKET_HOST,
                wsPort: parseInt(process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '6001', 10),
                forceTLS: window.location.protocol === 'https:',
                disableStats: true,
                enabledTransports: ['ws', 'wss'],
            });
            this.echo.connector.pusher.connection.bind('connected', () => {
                console.log('WebSocket connected');
            });
            this.echo.connector.pusher.connection.bind('disconnected', () => {
                console.log('WebSocket disconnected');
            });
            this.echo.connector.pusher.connection.bind('error', (error) => {
                console.error('WebSocket error:', error);
            });
        }
    }
    channel(channelName) {
        return {
            listen: (eventName, callback) => {
                console.log(`Listening to ${eventName} on channel ${channelName}`);
                this.echo.channel(channelName).listen(`.${eventName}`, (data) => {
                    console.log(`Received ${eventName} on channel ${channelName}:`, data);
                    callback(data);
                });
            }
        };
    }
    leaveChannel(channelName) {
        this.echo.leaveChannel(channelName);
    }
}
const echoClient = new EchoClient();
export default echoClient;
