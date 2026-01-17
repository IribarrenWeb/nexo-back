const mongoose = require("mongoose");
const { toPusher } = require("../services/pusher-service");

const notificationSchema = new mongoose.Schema(
  {
    data: { type: Object, required: true },
    title: { type: String, required: true },
    message: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.post("save", function (notification) {
  // enviar notificacion al frontend
  toPusher(`notifications-${notification.user}`, "new-notification", notification);
});

module.exports = mongoose.model("Notification", notificationSchema);
