const nodemailer = require('nodemailer');
/**
 * Servicio de correo electronico
 * - Proporciona funcionalidades para el envio de correos electrónicos
 * - Utiliza nodemailer para el envio de correos
 * - Soporta plantillas de correo para diferentes tipos de mensajes
 */
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

    /**
     * Metodo para enviar un correo electronico
     * - Utiliza el transporter configurado para enviar el correo
     * - Construye las opciones del correo incluyendo destinatario, asunto y contenido HTML
     * - Utiliza plantillas para el contenido del correo
     * 
     * @param {*} to 
     * @param {*} subject 
     * @param {*} data 
     * @param {*} template 
     * @returns Resultado del envio del correo
     */
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

    /**
     * Metodo para obtener la plantilla de correo segun el tipo
     * @param {*} type 
     * @param {*} data 
     * @returns Plantilla de correo en formato HTML
     */
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