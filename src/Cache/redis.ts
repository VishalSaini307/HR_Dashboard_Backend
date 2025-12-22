import { createClient } from "redis";

const  REDIS_URL = process.env.REDIS_URL  || 'redis://localhost:6379';

export  const  redisClient = createClient({
    url : REDIS_URL,
    socket:{
        reconnectStrategy: (retries) =>{
            if(retries > 10){
                return new Error('Max Retries Exceeded')    
                  console.warn('⚠️ Redis connection failed, continuing without cache');
        return false; // Stop reconnecting
            }else{
                return retries *50;
            }
        },
    },
});

redisClient.on('error',(err) =>{console.error('Redis Error:', err)});
redisClient.on('connect',() =>{console.log('redis connected')});
redisClient.on('disconnect',() => {console.log('redis disconnected')})

export const connectRedis = async () =>{
    if(!redisClient.isOpen){
        await redisClient.connect()
    }
}

