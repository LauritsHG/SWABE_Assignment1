//import { Router } from "express";
const express1 = require("express");
const orderController = express1.Router();

import { Request, Response } from "express";
import mongoose from "mongoose";
import { schema } from "../models/ReservationSchema";
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
  // let { cur, pri, mat } = req.query;
  // let filter = { currency: {}, price: {}, material: {} }; // {currency: {$exists: true},material: {$exists: true},price: {$exists: true}};
  // if (cur != null) filter.currency = cur;
  // else filter.currency = { $exists: true };
  // if (pri != null) filter.price = { $gte: pri };
  // else filter.price = { $exists: true };
  // if (mat != null) filter.material = mat;
  // else filter.material = { $exists: true };
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

const findReservation = async (req: Request, res: Response) => {
  ReservationModel.insertMany(seedData);
  res.setHeader("Content-Type", "application/json");
  res.json({ data: "SeedData added" });
};

const createReservation = async (req: Request, res: Response) => {
  //res.setHeader('Content-Type', 'application/json');
  //res.json({"data": "Hello Orders id"});
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.find({ _id: uid }).lean().exec();
  res.json(result);
};
// Slet hele document og ændre det til det nye
const updateReservation = async (req: Request, res: Response) => {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.replaceOne({ _id: uid }, data);
  res.json(result);
};
// Updater documentet
const deleteReservation = async (req: Request, res: Response) => {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.updateOne({ _id: uid }, data);
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
