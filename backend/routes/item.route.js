import express from "express";
import {
  addItem,
  editItem,
  getItemById,
    deleteItem,
} from "../controllers/item.controller.js";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);
itemRouter.delete("/delete/:itemId", isAuth, deleteItem);

export default itemRouter;

