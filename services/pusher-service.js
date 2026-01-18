const Pusher = require("pusher");

// configuramos pusher con las variables de entorno
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
});

// funcion para enviar notificaciones via pusher
// recibe el canal, evento y datos a enviar
const toPusher = (channel, event, data) => {
    try {
        pusher.trigger(channel, event, data);
    } catch (error) {
        console.error("Error al enviar notificación con Pusher:", error);
    }
}

module.exports = {
    toPusher,
}