import { Schema } from "mongoose";

export interface Reservation {
  userId: String;
  dateFrom: Date;
  dateTo: Date;
  roomId: Number;
}

export const schema = new Schema<Reservation>({
  userId: { type: String, required: true },
  dateFrom: { type: Date, required: true },
  dateTo: { type: Date, required: true },
  roomId: { type: Number, required: true },
});
