import { Router } from "express";
import { hello } from "../controller/hello.controller.js";

const helloRouter = Router();

helloRouter.route('/hello').get(hello);

export default helloRouter;