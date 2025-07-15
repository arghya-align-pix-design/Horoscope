// pages/api/socket.ts
import { Server as NetServer, Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { NextApiRequest } from 'next';
import { NextApiResponseServerIO } from './types/next';

const ioHandler = (_: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('🔌 Initializing Socket.IO server...');
    const httpServer: NetServer = res.socket.server as Server;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('✅ New client connected');

      socket.on('message', async (msg) => {
        console.log('User:', msg);

        // Call AI response
        const aiRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/ai-reply`, {
          method: 'POST',
          body: JSON.stringify({ message: msg }),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await aiRes.json();

        // Send back AI reply
        socket.emit('bot-reply', data.reply);
      });
    });

    res.socket.server.io = io;
  }
  //res.end();
};

export default ioHandler;
