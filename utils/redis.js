import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
    constructor() {
        this.client = redis.createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);

        this.client.on('error', (err) => {
            console.log(`Redis client not connected to the server: ${err.message}`);
        });

        this.client.on('connect', () => {
            console.log('Redis client connected to the server');
        });
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        const val = await this.getAsync(key);
        return val;
    }

    async set(key, val, duration) {
        this.client.setex(key, duration, val);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();

export default redisClient;