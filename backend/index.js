import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './socket.js';
dotenv.config();

import connectDb from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
import shopRouter from './routes/shop.route.js';
import itemRouter from './routes/item.route.js';
import orderRouter from './routes/order.route.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server,{
    cors:{
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST"]
}
})

app.set('io', io);


const PORT = Number(process.env.PORT) || 5000;
const MAX_PORT_RETRIES = 10;
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRouter);
app.use("/api/user",userRouter);
app.use("/api/shop",shopRouter);
app.use("/api/items",itemRouter);
app.use("/api/order",orderRouter);
socketHandler(io);

const startServer = (port, retryCount = 0) => {
    const onError = (error) => {
        if (error.code === 'EADDRINUSE' && retryCount < MAX_PORT_RETRIES) {
            const nextPort = port + 1;
            console.warn(`Port ${port} is in use. Retrying on ${nextPort}...`);
            startServer(nextPort, retryCount + 1);
            return;
        }

        console.error(`Failed to start server on port ${port}:`, error.message);
        process.exit(1);
    };

    server.once('error', onError);

    server.listen(port, () => {
        server.off('error', onError);
        connectDb();
        console.log(`Server is running on port ${port}`);
    });
};

startServer(PORT);