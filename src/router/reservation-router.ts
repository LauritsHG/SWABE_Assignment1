import { Router } from "express";
import { reservation } from "../controllers/reservation-controller";

const router = Router();

router.get("", reservation.reservationList);
router.get("/:uid", reservation.findReservation);
router.post("", reservation.createReservation);
router.patch("/:uid", reservation.updateReservation);
router.delete("/:uid", reservation.deleteReservation);

export const reservationRouter = router;
