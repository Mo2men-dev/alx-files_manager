import express from "express";

import AppController from "../controllers/AppController";
import UsersController from "../controllers/UsersController";

const mainRouter = (app) => {
    const router = express.Router();

    app.use("/", router);

    // App info routes
    router.get("/status", AppController.getStatus);
    router.get("/stats", AppController.getStats);

    // Users routes
    router.post("/users", UsersController.postNew);
};

export default mainRouter;