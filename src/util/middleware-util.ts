import { Request, Response, NextFunction } from "express";
import { readFile } from "fs";
import { decode, verify } from "jsonwebtoken";
import { join } from "path";
import { Role } from "../models/user-schema";

export const PATH_PUBLIC_KEY = join(
  __dirname,
  "..",
  "..",
  "src",
  "auth-rsa256.key.pub"
);

export interface MetaData {
  role: Role;
  userId: string;
}

export const getMetaDataFromToken = (req: Request): MetaData => {
  const token = req.get("authorization")?.split(" ")[1];
  if (token) {
    const jwt = decode(token, { json: true });
    return { role: jwt?.Role, userId: jwt?.UserId };
  } else {
    return { role: Role.clerk, userId: "" };
  }
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.get("authorization")?.split(" ")[1];
  if (token === undefined) {
    res.sendStatus(400);
  } else {
    readFile(PATH_PUBLIC_KEY, (err, publicKey) => {
      if (err) {
        res.sendStatus(500);
      } else {
        verify(token, publicKey, { complete: true }, (err, decoded) => {
          if (err) {
            res.status(400).json({
              message: err.message,
            });
          } else {
            next();
          }
        });
      }
    });
  }
};
