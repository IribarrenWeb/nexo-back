const nodemailer = require('nodemailer');

class MailService {
    transporter;

    constructor() {
        this.setupTransporter(); // inicializamos el transporter al crear la instancia
    }

    // seteamos el transporter de nodemailer con los datos de entorno
    setupTransporter() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.gmail.com',
            port: process.env.MAIL_PORT || 465,
            secure: true,
            from: process.env.MAIL_FROM,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    // metodo para enviar un email
    async sendEmail(to, subject, data, template) {
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to,
            subject,
            html: this.getTemplate(template, data),
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            return {
                message: 'Email enviado correctamente',
                response: info.response,
            }
        } catch (error) {
            throw error;
        }
    }

    getTemplate(type, data) {
        switch (type) {
            case 'welcome':
                return `<h3>Bienvenido a Nexo, ${data.name}!</h3>
                        <p>Se ha registrado un usuario con tu email.</p><br>
                        <p>Si no fuiste tu, por favor contacta con soporte.</p>
                        <br>
                        <p>Saludos,<br>El equipo de Nexo</p>
                        `;
            default:
                return `<h1>Notificación de Nexo</h1>
                        <p>Hola ${data.name}, este es un mensaje de notificación.</p>`;
        }
    }
}

module.exports = new MailService();