import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isProtected: {
      type: Boolean,
      default: false,
    },
    pin: {
      type: String,
      default: "000000",
    },
    user: {
      type: String,
      default: "Anonymous",
    },
  },
  {
    timestamps: true,
  }
)

const Board = mongoose.models.Board || mongoose.model("Board", boardSchema);

export default Board;