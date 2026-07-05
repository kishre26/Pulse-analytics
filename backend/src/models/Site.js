const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const siteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    domain: { type: String, required: true, trim: true },
    siteId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Site", siteSchema);
