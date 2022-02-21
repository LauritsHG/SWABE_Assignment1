import { Router } from "express";
import { room } from "../controllers/rooms";

const router = Router();

router.get("", room.roomsList);
router.get("/:uid", room.findRoom);
router.post("/:uid", room.createRoom);
router.patch("/:uid", room.updateRoom);
router.delete("/:uid", room.deleteRoom);

export const roomRouter = router;
