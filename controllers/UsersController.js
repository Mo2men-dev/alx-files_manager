import sha1 from "sha1";
import dbClient from "../utils/db";

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!email) return res.status(400).send({ error: "Missing email" });
        if (!password) return res.status(400).send({ error: "Missing password" });

        // Check if email is valid
        const user = await dbClient.users.find({ email });
        if (user) return res.status(400).send({ error: "Already exist" });

        // Create new user
        const newUser = await dbClient.users.insert({ email, password: sha1(password) });
        return res.status(201).send({ id: newUser.id, email: newUser.email });
    }

    static async getMe(req, res) {
        const token = req.header("X-Token");

        // Check if token is provided
        if (!token) return res.status(401).send({ error: "Unauthorized" });

        // Check if token is valid
        const user = await dbClient.users.find({ id: req.userId });
        if (!user) return res.status(401).send({ error: "Unauthorized" });

        return res.status(200).send({ id: user.id, email: user.email });
    }
}

export default UsersController;