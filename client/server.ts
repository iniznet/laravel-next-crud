import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { Counter } from './types/queue';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const nextjsPort = 3000;
const wsPort = 3001;
const app = next({ dev, hostname, port: nextjsPort });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            const parsedUrl = parse(req.url!, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    server.listen(nextjsPort, () => {
        console.log(`> Next.js ready on http://${hostname}:${nextjsPort}`);
    });

    // Separate WebSocket server
    const wsServer = createServer();
    const io = new SocketIOServer(wsServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('Client connected');

        socket.on('callNext', (data: Counter) => {
            console.log('Next call:', data);
            io.sockets.emit('counterUpdated', data);
            io.sockets.emit('activeCounterUpdated', data);
        });

        socket.on('recall', (data: Counter) => {
            console.log('Recall:', data);
            io.sockets.emit('activeCounterUpdated', data);
        });

        socket.on('updateCounter', (data: Counter) => {
            console.log('Update counter:', data);
            io.sockets.emit('counterUpdated', data);
        });

        socket.on('resetQueue', () => {
            console.log('Queue reset');
            io.sockets.emit('queueReset');
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    wsServer.listen(wsPort, () => {
        console.log(`> WebSocket server ready on ws://${hostname}:${wsPort}`);
    });
});
