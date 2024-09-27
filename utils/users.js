import redisClient from "./redis.js";

export const getUserId = async (req) => {
    const token = req.header("X-Token");
    const userId = await redisClient.get(`auth_${token}`);

    if (!userId) return null;

    return userId;
}