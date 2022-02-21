import { Schema } from "mongoose";

export interface Reservation {
  user: String;
  dateFrom: Date;
  dateTo: Date;
  roomId: Number;
}

export const schema = new Schema<Reservation>({
  user: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  roomId: { type: Number, required: true },
});
