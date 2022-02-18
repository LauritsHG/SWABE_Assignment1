import { Schema } from "mongoose";

export interface Reservation {
  User: String;
  DateFrom: String;
  DateTo: String;
  RoomId: Number;
}

export const schema = new Schema<Reservation>({
  User: { type: String, required: true },
  DateFrom: { type: String, required: true },
  DateTo: { type: String, required: true },
  RoomId: { type: Number, required: true },
});
