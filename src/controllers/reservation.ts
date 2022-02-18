//import { Router } from "express";
const express1 = require("express");
const orderController = express1.Router();

import { Request, Response } from "express";
import mongoose from "mongoose";
import { schema } from "../ReservationSchema";
import seedData from "./SeedDataForDb.json";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
const ReservationModel = dbConnection.model("Reservation", schema);

orderController.get("/", async function (req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  let result = await ReservationModel.find().lean().exec();
  res.json(result);
  // look in bottom of scripts for a smarter filter way
});

orderController.post("/", async function (req: any, res: any) {
  const data = req.body;

  let { id } = await ReservationModel.create(data);
  res.setHeader("Content-Type", "application/json");
  res.json({ id: id });
});

orderController.post("/seedData", function (req: any, res: any) {
  ReservationModel.insertMany(seedData);
  res.setHeader("Content-Type", "application/json");
  res.json({ data: "SeedData added" });
});

orderController.get("/:uid", async function (req: any, res: any) {
  //res.setHeader('Content-Type', 'application/json');
  //res.json({"data": "Hello Orders id"});
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.find({ _id: uid }).lean().exec();
  res.json(result);
});
// Slet hele document og ændre det til det nye
orderController.put("/:uid", async function (req: any, res: any) {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.replaceOne({ _id: uid }, data);
  res.json(result);
});
// Updater documentet
orderController.patch("/:uid", async function (req: any, res: any) {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.updateOne({ _id: uid }, data);
  res.json(result);
});

orderController.delete("/:uid", async function (req: any, res: any) {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await ReservationModel.deleteOne({ _id: uid });
  res.json(result);
});

module.exports = orderController;

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
