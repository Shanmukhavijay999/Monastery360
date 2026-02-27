import mongoose from "mongoose";

const monasterySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.model("Monastery", monasterySchema);
