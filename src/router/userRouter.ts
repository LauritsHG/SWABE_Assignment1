import { Router } from "express";
import { user } from "../controllers/users";

const router = Router();

router.get("/users/:uid", user.findUser);
router.get("/users", user.listUsers);
router.post("/user", user.createUser);
router.post("/login", user.login);

export const userRouter = router;
