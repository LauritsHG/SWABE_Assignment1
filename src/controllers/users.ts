import { Request, Response } from "express";
import mongoose from "mongoose";
import { schema } from "../models/RoomSchema";
import { User } from "../models/UserSchema";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
const UserModel = dbConnection.model("users", schema);

const findUser = async (req: Request, res: Response) => {
  const { uid } = req.params;

  let result: User = await UserModel.find({ _id: uid }).lean().exec();

  res.json(result);
};

const listUsers = async (req: Request, res: Response) => {
  let result = await UserModel.find({}, { email: "", _id: "" }).lean().exec();
  res.json(result);
};

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;
  // if (await userExists(email)) {
  //   res.status(400).json({
  //     message: "User already exists",
  //   });
  // } else {
  //   let salt = await randomBytes(SALT_LENGTH);
  //   let hashed = await pbkdf2(
  //     password,
  //     salt.toString("hex"),
  //     ITERATIONS,
  //     KEY_LENGTH,
  //     DIGEST
  //   );
  //   let user = newUser(email);
  //   user.password.setPassword(hashed.toString("hex"), salt.toString("hex"));
  //   await user.save();
  //   res.json(user);
  // }
};

const login = async (req: Request, res: Response) => {};

const userExists = (email: string) => UserModel.findOne({ email }).exec();

export const user = {
  findUser,
  listUsers,
  createUser,
  login,
};
