class RedisClient {
    constructor() {
        this.client = redis.createClient();
    }

    isAlive() {
        return this.client.connected;
    }

    async get(key) {
        return this.client.get(key);
    }

    async set(key, value, duration) {
        this.client.setex(key, duration, value);
    }

    async del(key) {
        this.client.del(key);
    }
}

const redisClient = new RedisClient();

export default redisClient;