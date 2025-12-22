import { createClient } from "redis";

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');
const REDIS_URL = `redis://${REDIS_HOST}:${REDIS_PORT}`;

export const redisClient = createClient({
    url: REDIS_URL,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.warn('⚠️ Redis connection failed, continuing without cache');
                return false; // Stop reconnecting
            } else {
                return retries * 50;
            }
        },
    },
});

redisClient.on('error', (err) => { console.error('Redis Error:', err) });
redisClient.on('connect', () => { console.log('✅ Redis connected') });
redisClient.on('disconnect', () => { console.log('Redis disconnected') })

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect()
    }
}

