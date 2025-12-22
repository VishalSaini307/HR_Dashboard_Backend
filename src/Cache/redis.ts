import { createClient } from "redis";

// Use REDIS_URL if available (Railway, production), otherwise construct from host/port (local dev)
const REDIS_URL = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`;

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

