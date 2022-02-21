import { Router } from "express";
import { reservation } from "../controllers/reservation";

const router = Router();

router.get("", reservation.reservationList);
router.get("/:uid", reservation.findReservation);
router.post("/:uid", reservation.createReservation);
router.patch("/:uid", reservation.updateReservation);
router.delete("/:uid", reservation.deleteReservation);

export const reservationRouter = router;
