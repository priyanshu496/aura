import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
    required: true,
  },

  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});

const Room = mongoose.model('room', roomSchema)

export default Room;