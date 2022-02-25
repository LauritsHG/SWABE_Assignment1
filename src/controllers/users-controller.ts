import { Request, Response } from "express";
import mongoose from "mongoose";
import { schema } from "../models/user-schema";
import { User } from "../models/user-schema";
import {
  randomBytes,
  SALT_LENGTH,
  pbkdf2,
  DIGEST,
  KEY_LENGTH,
  ITERATIONS,
} from "../util/crypto-util";
import { sign } from "jsonwebtoken";
import { readFile } from "fs";
import { join } from "path";

const PATH_PRIVATE_KEY = join(
  __dirname,
  "..",
  "..",
  "..",
  "SWABE_Assignment1",
  "src",
  "auth-rsa256.key"
);

const X5U = "http://localhost:3000/auth-rsa256.key.pub";

const dbConnection = mongoose.createConnection(
  "mongodb://localhost:27017/Assignment1"
);
const UserModel = dbConnection.model("users", schema);

const findUser = async (req: Request, res: Response) => {
  const { uid } = req.params;

  let result: User = await UserModel.find(
    { _id: uid },
    { firstName: 1, lastName: 1, email: 1, role: 1 }
  )
    .lean()
    .exec();

  res.json(result);
};

const listUsers = async (req: Request, res: Response) => {
  let result = await UserModel.find({}, { email: 1 }).lean().exec();
  res.json(result);
};

const createUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, role, password } = req.body;
  if (await userExists(email)) {
    res.status(400).json({
      message: "User already exists",
    });
  } else {
    let salt = await randomBytes(SALT_LENGTH);
    let hashed = await pbkdf2(
      password,
      salt.toString("hex"),
      ITERATIONS,
      KEY_LENGTH,
      DIGEST
    );

    let user = new UserModel({
      firstName: firstName,
      lastName: lastName,
      email: email,
      role: role,
      password: hashed.toString("hex"),
      salt: salt.toString("hex"),
    });

    await user.save();
    res.json(user);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  res.setHeader("Content-Type", "application/json");

  let user = await UserModel.findOne({ email: email }).lean().exec();

  //await user.isPasswordValid(password as string)
  if (user) {
    if (await isPasswordValid(password, user.salt, user.password)) {
      readFile(PATH_PRIVATE_KEY, (err, privateKey) => {
        if (err) {
          res.sendStatus(500);
        } else {
          sign(
            { email, Role: user.role, UserId: user._id },
            privateKey,
            { expiresIn: "1h", header: { alg: "RS256", x5u: X5U } },
            (err: any, token: any) => {
              if (err) {
                res.status(500).json({
                  message: err.message,
                });
              } else {
                res.json({ token });
              }
            }
          );
        }
      });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400);
  }
};

const userExists = (email: string) => UserModel.findOne({ email }).exec();

export const user = {
  findUser,
  listUsers,
  createUser,
  login,
};
// Should be in the user schema.
let isPasswordValid = async function (
  password: string,
  salt: string,
  userHash: string
) {
  const hash = await pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST);
  return userHash === hash.toString("hex");
};
