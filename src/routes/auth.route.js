import { Router } from "express";//ye aisa he likha jata hai. we import Router from express. Router is a class which we use to create routes. we can create multiple routers and then combine them in app.js
import {registerUser} from "../controllers/auth.controller.js"

const router = Router();

//no route '/'
router.route("/register").post(registerUser)
export default router;