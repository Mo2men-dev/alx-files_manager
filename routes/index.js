import express from "express";

import AppController from "../controllers/AppController";
import UsersController from "../controllers/UsersController";
import AuthController from "../controllers/AuthController";
import FilesController from "../controllers/FilesController";

const mainRouter = (app) => {
    const router = express.Router();

    app.use("/", router);

    // App info routes
    router.get("/status", AppController.getStatus);
    router.get("/stats", AppController.getStats);

    // Auth routes
    router.get("/connect", AuthController.getConnect);
    router.get("/disconnect", AuthController.getDisconnect);

    // Users routes
    router.post("/users", UsersController.postNew);
    router.get("/users/me", UsersController.getMe);

    // Files routes
    router.post("/files", FilesController.postUpload);
    router.get("/files/:id", FilesController.getShow);
    router.get("/files", FilesController.getIndex);
    router.put("/files/:id/publish", FilesController.putPublish);
    router.put("/files/:id/publish", FilesController.putUnpublish);
};

export default mainRouter;