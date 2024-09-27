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
}

export default FilesController;