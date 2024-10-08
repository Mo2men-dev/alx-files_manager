import fs from 'fs';
import mime from 'mime-types';

import dbClient from "../utils/db";
import { getUserId } from "../utils/users";

const ALLOWED_TYPES = ["folder", "file", "image"];
const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {    
    static async postUpload(req, res) {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        const { name, type, parentId, isPublic, data } = req.body;

        if (!name) return res.status(400).send({ error: "Missing name" });
        if (!type || !ALLOWED_TYPES.includes(type)) return res.status(400).send({ error: "Missing type" });
        if (type !== "folder" && !data) return res.status(400).send({ error: "Missing data" });

        if (parentId !== 0) {
            const parent = await dbClient.files.find({ userId, id: parentId });
            if (!parent) return res.status(400).send({ error: "Parent not found" });
        }

        const file = await dbClient.files.insert({
            userId,
            name,
            type,
            parentId,
            isPublic: isPublic || false,
        });

        const filePath = `${FOLDER_PATH}/${file.id}`;

        if (type !== "folder") {
            const buff = Buffer.from(data, "base64");
            await fs.promises.writeFile(filePath, buff);
        }

        return res.status(201).send(file);
    }

    static async getIndex(req, res) {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        const files = await dbClient.files.find({ userId });

        return res.status(200).send(files);
    }

    static async getShow(req, res) {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        const { id } = req.params;
        const file = await dbClient.files.find({ userId, id });

        if (!file) return res.status(404).send({ error: "Not found" });

        return res.status(200).send(file);
    }

    static async putPublish(req, res) {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        const { id } = req.params;
        const file = await dbClient.files.find({ userId, id });

        if (!file) return res.status(404).send({ error: "Not found" });

        file.isPublic = true;
        await dbClient.files.save(file);

        return res.status(200).send(file);
    }

    static async putUnpublish(req, res) {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        const { id } = req.params;
        const file = await dbClient.files.find({ userId, id });

        if (!file) return res.status(404).send({ error: "Not found" });

        file.isPublic = false;
        await dbClient.files.save(file);

        return res.status(200).send(file);
    }

    static async getFile(req, res) {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).send({ error: "Unauthorized" });

        const { id } = req.params;
        const file = await dbClient.files.find({ userId, id });

        if (!file) return res.status(404).send({ error: "Not found" });
        if (file.type === "folder") return res.status(400).send({ error: "A folder doesn't have content" });

        const filePath = `${FOLDER_PATH}/${file.id}`;
        const contentType = mime.contentType(file.name);

        res.setHeader("Content-Type", contentType);

        const data = null;

        try {
            data = await fs.promises.readFile(filePath);
        } catch (error) {
            return res.status(404).send({ error: "Not found" });
        }

        return res.status(200).send(data);
    }
}

export default FilesController;