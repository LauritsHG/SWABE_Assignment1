import { Request, Response } from "express";
import mongoose from "mongoose";
import { Reservation, schema } from "../models/reservation-schema";
import { getMetaDataFromToken } from "../util/middleware-util";
import { Role } from "../models/user-schema";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
export const ReservationModel = dbConnection.model("Reservation", schema);

//needs only to be accessible for roles manager, clerk
const reservationList = async (req: Request, res: Response) => {
  let filter = {};

  let { role } = getMetaDataFromToken(req);
  if (role === Role.manager || role === Role.clerk) {
    const { from, to } = req.query;

    if (from && to) {
      filter = { dateFrom: { $gte: from }, dateTo: { $lte: to } };
    } else if (from) {
      filter = { dateFrom: { $gte: from } };
    } else if (to) {
      filter = { dateTo: { $lte: to } };
    }
    let result = await ReservationModel.find(filter).lean().exec();
    res.json(result);
  } else {
    res
      .status(401)
      .send(
        "Permision denied: only manager and clerk can get all reservations"
      );
  }
};

//needs only to be accessible for roles manager, clerk, and guest (if created by guest)
const findReservation = async (req: Request, res: Response) => {
  const { role, userId } = getMetaDataFromToken(req);
  const { uid } = req.params;

  let reservation: Reservation = await ReservationModel.findOne({
    _id: uid,
  }).exec();
  if (
    role === Role.clerk ||
    role === Role.manager ||
    (role === Role.guest && reservation.userId === userId)
  ) {
    let result = await ReservationModel.find({ _id: uid }).exec();
    res.json(result);
  } else {
    res.status(401).send("Permision denied");
  }
};

const createReservation = async (req: Request, res: Response) => {
  const { dateFrom, dateTo, roomId } = req.body;
  const { userId } = getMetaDataFromToken(req);

  let filter = {};

  if (dateFrom && dateTo) {
    filter = {
      dateFrom: { $gte: dateFrom },
      dateTo: { $lte: dateTo },
      roomId: roomId,
    };

    let result = await ReservationModel.findOne(filter).lean().exec();
    if (result) res.status(400).send("Date and/or room already taken");
    else {
      let reservation = new ReservationModel({
        userId: userId,
        dateFrom: dateFrom,
        dateTo: dateTo,
        roomId: roomId,
      });

      await reservation.save();
      res.json(reservation);
    }
  } else res.status(400).send("Please specify dates");
};

//needs only to be accessible for roles manager, clerk, and guest (if created by guest)
const updateReservation = async (req: Request, res: Response) => {
  const { role, userId } = getMetaDataFromToken(req);
  const { uid } = req.params;

  let reservation: Reservation = await ReservationModel.findOne({
    _id: uid,
  }).exec();

  if (
    role === Role.clerk ||
    role === Role.manager ||
    (role === Role.guest && reservation.userId === userId)
  ) {
    const body = req.body;
    let result = await ReservationModel.updateOne(
      { _id: uid },
      { $set: body }
    ).exec();
    res.json({ uid, result });
  } else {
    res.sendStatus(401).send("Permision denied");
  }
};

//needs only to be accessible for roles manager and clerk
const deleteReservation = async (req: Request, res: Response) => {
  const { role } = getMetaDataFromToken(req);

  if (role === Role.manager || role === Role.clerk) {
    const { uid } = req.params;
    let result = await ReservationModel.deleteOne({ _id: uid });
    res.json(result);
  } else {
    res
      .status(401)
      .send("Permision denied: only manager and clerk can delete reservation");
  }
};

export const reservation = {
  reservationList,
  findReservation,
  createReservation,
  updateReservation,
  deleteReservation,
};
