//import { Router } from "express";
const express1 = require("express");
const orderController = express1.Router();

import { Request, Response } from "express";
import mongoose from "mongoose";
import { Reservation, schema } from "../models/ReservationSchema";
import seedData from "./SeedDataForDb.json";
import { decode } from "jsonwebtoken";
// import { dbConnection } from "../index";

// There should only be one connection
const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
const ReservationModel = dbConnection.model("Reservation", schema);

const reservationList = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");

  //Test af JWT
  // MANGLER CHECK AF TOKEN, HER DECODES KUN der verifies IKKE Paa DEN.
  const token = req.get("authorization")?.split(" ")[1];
  if (token) {
    const jwt = decode(token, { json: true });
    if (jwt?.Role === "MANAGER") {
      let result = await ReservationModel.find({}).lean().exec();
      res.json(result);
    } else {
      res.sendStatus(401);
    }
  } else {
    res.sendStatus(400);
  }

  // look in bottom of scripts for a smarter filter way
};

//needs only to be accessible for roles manager, clerk, and guest (if created by guest)
const findReservation = async (req: Request, res: Response) => {
  const { uid } = req.params;
  let result = await ReservationModel.find({ _uid: uid }).exec();
  res.json(result);
};

const createReservation = async (req: Request, res: Response) => {
  const { userId, dateFrom, dateTo, roomId } = req.body;

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
  const { uid } = req.params;
  const body = req.body;
  let result = await ReservationModel.updateOne(
    { _id: uid },
    { $set: body }
  ).exec();
  res.json({ uid, result });
};

//needs only to be accessible for roles manager and clerk
const deleteReservation = async (req: Request, res: Response) => {
  const { uid } = req.params;
  let result = await ReservationModel.deleteOne({ _id: uid });
  res.json(result);
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
