//import { Router } from "express";
const express1 = require("express");
const userController = express1.Router();

import { Request, Response } from "express";
import mongoose from "mongoose";
import { schema } from "../RoomSchema";
import seedData from "./SeedDataForDb.json";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
const UserModel = dbConnection.model("users", schema);

userController.get("/", async function (req: any, res: any) {
  res.setHeader("Content-Type", "application/json");
  let { cur, pri, mat } = req.query;
  let filter = { currency: {}, price: {}, material: {} }; // {currency: {$exists: true},material: {$exists: true},price: {$exists: true}};
  if (cur != null) filter.currency = cur;
  else filter.currency = { $exists: true };
  if (pri != null) filter.price = { $gte: pri };
  else filter.price = { $exists: true };
  if (mat != null) filter.material = mat;
  else filter.material = { $exists: true };
  let result = await UserModel.find(filter).lean().exec();
  res.json(result);
  // look in bottom of scripts for a smarter filter way
});

userController.post("/", async function (req: any, res: any) {
  const data = req.body;

  let { id } = await UserModel.create(data);
  res.setHeader("Content-Type", "application/json");
  res.json({ id: id });
});

userController.post("/seedData", function (req: any, res: any) {
  UserModel.insertMany(seedData);
  res.setHeader("Content-Type", "application/json");
  res.json({ data: "SeedData added" });
});

userController.get("/:uid", async function (req: any, res: any) {
  //res.setHeader('Content-Type', 'application/json');
  //res.json({"data": "Hello Orders id"});
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await UserModel.find({ _id: uid }).lean().exec();
  res.json(result);
});
// Slet hele document og ændre det til det nye
userController.put("/:uid", async function (req: any, res: any) {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await UserModel.replaceOne({ _id: uid }, data);
  res.json(result);
});
// Updater documentet
userController.patch("/:uid", async function (req: any, res: any) {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await UserModel.updateOne({ _id: uid }, data);
  res.json(result);
});

userController.delete("/:uid", async function (req: any, res: any) {
  const data = req.body;
  res.setHeader("Content-Type", "application/json");
  let { uid } = req.params;
  let result = await UserModel.deleteOne({ _id: uid });
  res.json(result);
});

module.exports = userController;

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
