import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
    static getStatus(_req, res) {
        const redis = redisClient.isAlive();
        const db = dbClient.isAlive();
        res.status(200).send({ redis, db });
    }
    
    static async getStats(_req, res) {
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();
        res.status(200).send({ users, files });
    }
}

export default AppController;