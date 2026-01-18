const User = require("../models/userModel");

// seeder para poblar la base de datos con usuarios

const users = [
    // usuarios admin
    { name: 'nexo', lastName: 'master', username: 'nexo', email: 'nexomaster2@nexo.com', password: 'password0', rol: 'admin' },
    { name: 'nexo2', lastName: 'master2', username: 'nexo2', email: 'nexomaster1@nexo.com', password: 'password0', rol: 'admin' },

    // usuarios normales
    { name: 'Pablo', lastName: 'Gonzalez', username: 'pablog', email: 'pgonzalez@nexo.com', password: 'password0', avatar: 'https://i.pravatar.cc/150?img=0' },
    { name: 'Maria', lastName: 'Lopez', username: 'marial', email: 'mlopez@nexo.com', password: 'password1', avatar: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Juan', lastName: 'Martinez', username: 'juanmart', email: 'jmartinez@nexo.com', password: 'password2', avatar: 'https://i.pravatar.cc/150?img=2' },
    { name: 'Ana', lastName: 'Garcia', username: 'anag', email: 'agarcia@nexo.com', password: 'password3', avatar: 'https://i.pravatar.cc/150?img=3' },
    { name: 'Luis', lastName: 'Rodriguez', username: 'luisr', email: 'lrodriguez@nexo.com', password: 'password4', avatar: 'https://i.pravatar.cc/150?img=4' },
    { name: 'Carmen', lastName: 'Hernandez', username: 'carmenh', email: 'chernandez@nexo.com', password: 'password5', avatar: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Jorge', lastName: 'Sanchez', username: 'jorges', email: 'jsanchez@nexo.com', password: 'password6', avatar: 'https://i.pravatar.cc/150?img=6' },
    { name: 'Lucia', lastName: 'Ramirez', username: 'luciar', email: 'lramirez@nexo.com', password: 'password7', avatar: 'https://i.pravatar.cc/150?img=7' },
    { name: 'Diego', lastName: 'Cruz', username: 'diegoc', email: 'dcruz@nexo.com', password: 'password8', avatar: 'https://i.pravatar.cc/150?img=8' },
    { name: 'Sofia', lastName: 'Flores', username: 'sofial', email: 'sflores@nexo.com', password: 'password9', avatar: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Alvaro', lastName: 'Torres', username: 'alvarot', email: 'atorres@nexo.com', password: 'password10', avatar: 'https://i.pravatar.cc/150?img=10' },
    { name: 'Elena', lastName: 'Rivera', username: 'elenar', email: 'erivera@nexo.com', password: 'password11', avatar: 'https://i.pravatar.cc/150?img=11' },
    { name: 'Fernando', lastName: 'Gomez', username: 'fernandog', email: 'fenandog@nexo.com', password: 'password12', avatar: 'https://i.pravatar.cc/150?img=12' },
    { name: 'Marta', lastName: 'Diaz', username: 'martad', email: 'martad@nexo.com', password: 'password13', avatar: 'https://i.pravatar.cc/150?img=13' },
]

/**
 * Funcion para poblar la base de datos con usuarios iniciales
 * - Recorre el array de usuarios definidos
 * - Verifica si el usuario ya existe en la base de datos
 * - Si no existe, crea un nuevo usuario y lo guarda en la base de datos
 */
const seeder = () => {
    
    users.forEach(async (user) => {
        
        const exists = await User.exists({ $or: [ { email: user.email }, { username: user.username } ] })
        if (!exists) {
            const { name, lastName, username, email, password, avatar, rol } = user;

            // creamos el nuevo usuario
            const newUser = new User({
                name: name,
                lastName: lastName,
                username: username,
                email: email,
                password: password,
                avatar: avatar ?? '',
                rol: rol?.length ? rol : 'user',
            });

            await newUser.save();
        }
    });
};

module.exports = {
    seeder
}