import { Request, Response } from "express";
import mongoose from "mongoose";
import { Reservation, schema } from "../models/reservation-schema";
import { decode } from "jsonwebtoken";
import { getMetaDataFromToken } from "../util/middleware-util";
import { Role } from "../models/user-schema";
// import { dbConnection } from "../index";

// There should only be one connection
const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
const ReservationModel = dbConnection.model("Reservation", schema);

const reservationList = async (req: Request, res: Response) => {
  let filter = {};

  let { role, userId } = getMetaDataFromToken(req);
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
  const { role, userId } = getMetaDataFromToken(req);

  let reservation = new ReservationModel({
    userId: userId,
    dateFrom: dateFrom,
    dateTo: dateTo,
    roomId: roomId,
  });

  await reservation.save();
  res.json(reservation);
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
  const { role, userId } = getMetaDataFromToken(req);

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

// const { src, dst, f, t } = req.query

// let filter = { }

// if(src) {
//   filter = { src }
// }

// if(dst) {
//   filter = { ...filter, dst }
// }

// if(f && t) {
//   filter = { ...filter, ts: { $gt: f, $lt: t }}
// } else {
//   if(f) {
//     filter = { ...filter, ts: { $gt: f }}
//   }
//   if(t) {
//     filter = { ...filter, ts: { $lt: t }}
//   }
// }

// let result = await TransactionModel.find(filter, { __v: 0 }).lean()
// res.json(result);
