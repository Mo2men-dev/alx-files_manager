import sha1 from "sha1";
import { v4 as uuidv4 } from "uuid";

import dbClient from "../utils/db";
import redisClient from "../utils/redis";

class AuthController {
    static async getConnect(req, res) {
        const auth = req.header("Authorization");

        // Check if Authorization header is provided
        if (!auth) return res.status(401).send({ error: "Unauthorized" });

        // Get email and password from Authorization header
        const buff = Buffer.from(auth.replace("Basic ", ""), "base64");
        const creds = buff.toString("utf-8");
        const [email, password] = creds.split(":");

        // Check if email and password are provided
        if (!email || !password) return res.status(401).send({ error: "Unauthorized" });

        // Check if email is valid
        const user = await dbClient.users.find({ email, password: sha1(password) });

        // Check if user exists
        if (!user) return res.status(401).send({ error: "Unauthorized" });

        // Generate token
        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 86400);

        return res.status(200).send({ token });
    }

    static async getDisconnect(req, res) {
        const token = req.header("X-Token");

        // Check if token is provided
        if (!token) return res.status(401).send({ error: "Unauthorized" });

        // Check if token is valid
        const userId = await redisClient.get(`auth_${token}`);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        // Delete token
        await redisClient.del(`auth_${token}`);

        return res.status(204).send();
    }
}

export default AuthController;