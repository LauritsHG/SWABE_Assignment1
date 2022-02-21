import { Schema } from "mongoose";
import { DIGEST, ITERATIONS, KEY_LENGTH, pbkdf2 } from "../util/crypto-util";

export enum Role {
  manager = "MANAGER",
  clerk = "CLERK",
  guest = "GUEST",
}
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  password: string;
  salt: string;
  isPasswordValid(password: string): boolean;
}

export const schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});

schema.methods.isPasswordValid = async function (password: string) {
  const hash = await pbkdf2(
    password,
    this.salt,
    ITERATIONS,
    KEY_LENGTH,
    DIGEST
  );
  return this.hash === hash.toString("hex");
};
