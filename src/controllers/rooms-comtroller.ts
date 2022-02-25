//import { Router } from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { schema } from "../models/room-schema";
// import { dbConnection } from "../index";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);

const RoomModel = dbConnection.model("rooms", schema);

const roomsList = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  let { cur, pri, mat } = req.query;
  let filter = { currency: {}, price: {}, material: {} }; // {currency: {$exists: true},material: {$exists: true},price: {$exists: true}};
  if (cur != null) filter.currency = cur;
  else filter.currency = { $exists: true };
  if (pri != null) filter.price = { $gte: pri };
  else filter.price = { $exists: true };
  if (mat != null) filter.material = mat;
  else filter.material = { $exists: true };
  let result = await RoomModel.find(filter).lean().exec();
  res.json(result);
  // look in bottom of scripts for a smarter filter way
};

const findRoom = async (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json({ data: "SeedData added" });
};

const createRoom = async (req: Request, res: Response) => {
  //res.setHeader('Content-Type', 'application/json');
  //res.json({"data": "Hello Orders id"});
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await RoomModel.find({ _id: uid }).lean().exec();
  res.json(result);
};
// Slet hele document og ændre det til det nye
const updateRoom = async (req: Request, res: Response) => {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await RoomModel.replaceOne({ _id: uid }, data);
  res.json(result);
};
// Updater documentet
const deleteRoom = async (req: Request, res: Response) => {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await RoomModel.updateOne({ _id: uid }, data);
  res.json(result);
};

export const room = {
  roomsList,
  findRoom,
  createRoom,
  updateRoom,
  deleteRoom,
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
