import { Schema } from "mongoose";

export interface User {
  firstName: String;
  lastName: String;
  email: String;
  password: String;
  salt: String;
}

export const schema = new Schema<User>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  salt: { type: String, required: true },
});
