//import { Router } from "express";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Room, schema } from "../models/room-schema";
import { getMetaDataFromToken } from "../util/middleware-util";
import { Role } from "../models/user-schema";

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
  const { uid } = req.params;

  let room: Room = await RoomModel.findOne({
    _id: uid,
  }).exec();
  if (room) {
    res.json(room);
  } else {
    res.status(400).send("Room not found");
  }
};

const createRoom = async (req: Request, res: Response) => {
  const { roomNumber, numOfBeds, pricePerNight, oceanView } = req.body;
  const { role } = getMetaDataFromToken(req);

  if (role === Role.manager) {
    let room = new RoomModel({
      roomNumber: roomNumber,
      numOfBeds: numOfBeds,
      pricePerNight: pricePerNight,
      oceanView: oceanView,
    });
    await room.save();
    res.json(room);
  } else res.status(401).send("Access denied only managers can create a room");
};
// Slet hele document og ændre det til det nye
const updateRoom = async (req: Request, res: Response) => {
  const { role } = getMetaDataFromToken(req);
  const { uid } = req.params;
  if (role === Role.manager || role === Role.clerk) {
    const body = req.body;
    let result = await RoomModel.updateOne({ _id: uid }, { $set: body }).exec();
    res.json({ uid, result });
  } else
    res
      .status(401)
      .send("Access denied only managers and clerks can update a room");
};
// Updater documentet
const deleteRoom = async (req: Request, res: Response) => {
  const { role } = getMetaDataFromToken(req);
  const { uid } = req.params;
  if (role === Role.manager) {
    let result = await RoomModel.deleteOne({ _id: uid }).exec();
    res.json({ result });
  } else res.status(401).send("Access denied only managers can delete a room");
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
