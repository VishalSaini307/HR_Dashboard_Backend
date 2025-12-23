import { redisClient } from "./redis.js";


const CACHE_DURATION = 3600;

export const getCache = async (key : string) =>{
    try {
        const data = await redisClient.get(key);
        if (data) {
            console.log(`📦 [CACHE HIT] Data retrieved from Redis: ${key}`);
            return JSON.parse(data);
        }
        console.log(`❌ [CACHE MISS] Data not in Redis: ${key}`);
        return null;
    } catch (error) {
        console.error('cache get error:',error)
        return null;
        
    }
};
export const setCache = async (key : string, value : any , duration = CACHE_DURATION) =>{
    try {
        await redisClient.setEx(key ,duration , JSON.stringify(value))
        console.log(`💾 [CACHE SAVED] Data cached in Redis: ${key} (TTL: ${duration}s)`);
    } catch (err) {
        console.error("Cache set error",err)
        
    }
}
export const deleteCache = async (key : string )=>{
    try {
        const result = await redisClient.del(key);
        if (result > 0) {
            console.log(`🗑️ [CACHE CLEARED] Data removed from Redis: ${key}`);
        }
    } catch (error) {
        console.error("Cache delete Error" , error)
    }
}
export const clearCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (err) {
    console.error('Cache clear error:', err);
  }
};