import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

class EchoClient {
    private echo: Echo = null!;

    constructor() {
        if (typeof window !== 'undefined') {
            (window as any).Pusher = Pusher;

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

            this.echo.connector.pusher.connection.bind('error', (error: any) => {
                console.error('WebSocket error:', error);
            });
        }
    }

    public channel(channelName: string) {
        return {
            listen: (eventName: string, callback: (e: any) => void) => {
                console.log(`Listening to ${eventName} on channel ${channelName}`);
                this.echo.channel(channelName).listen(`.${eventName}`, (data: any) => {
                    console.log(`Received ${eventName} on channel ${channelName}:`, data);
                    callback(data);
                });
            }
        };
    }

    public leaveChannel(channelName: string) {
        this.echo.leaveChannel(channelName);
    }
}

const echoClient = new EchoClient();
export default echoClient;