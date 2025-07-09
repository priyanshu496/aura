import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.Mixed, 
      required: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//middleware for if sender is ai
messagesSchema.pre('save', function(next) {

  if (this.sender === 'auraAI') {
    next();
  } else {
 
    if (!mongoose.Types.ObjectId.isValid(this.sender)) {
      next(new Error('Invalid sender ObjectId'));
    } else {
      next();
    }
  }
});

const Messages = mongoose.model("Messages", messagesSchema);

export default Messages;