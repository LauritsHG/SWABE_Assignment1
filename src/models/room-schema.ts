import { Schema } from "mongoose";

export interface Room {
  roomNumber: Number;
  numOfBeds: Number;
  pricePerNight: Number;
  oceanView: Boolean;
}

export const schema = new Schema<Room>({
  roomNumber: { type: Number, required: true },
  numOfBeds: { type: Number, required: false },
  pricePerNight: { type: Number, required: true },
  oceanView: { type: Boolean, required: true },
});
