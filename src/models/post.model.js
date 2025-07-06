import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  content: {
    type: String,
    required: true,
  },

  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],

  date: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Post", postSchema);
