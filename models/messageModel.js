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
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }, 
    timestamps: true
  }
);

messageSchema.post("save", function (message) {
  message.populate("from to", "name lastName username avatar").then(() => {
    const toUserId = message.to._id.toString();
    // enviar notificacion al frontend
    toPusher(`messages-${toUserId}`, "new-message", message);
  }).catch((err) => {
    console.error("Error cargando modelos", err);
  });
})

module.exports = mongoose.model("Message", messageSchema);
