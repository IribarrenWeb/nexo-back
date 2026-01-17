const mongoose = require("mongoose");
const { toPusher } = require("../services/pusher-service");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

messageSchema.post("save", function (message) {
  // enviar notificacion al frontend
  toPusher(`messages-${message.to}`, "new-message", message);
})

module.exports = mongoose.model("Message", messageSchema);
