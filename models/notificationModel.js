const mongoose = require("mongoose");
const { toPusher } = require("../services/pusher-service");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    read: {
      type: Boolean,
      default: false,
    },
    data: { type: Object, required: false },
  },
  { timestamps: true }
);

notificationSchema.post("save", function (notification) {
  // enviar notificacion al frontend
  toPusher(`notifications-${notification.user}`, "new-notification", notification);
});

module.exports = mongoose.model("Notification", notificationSchema);
