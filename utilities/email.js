const mailer = require('nodemailer');

const sendMail = async (options) => {
    const transporter = mailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //Define options for email
    const emailOptions = {
        from: "Book My Stay Support<support@bookmystay.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    await transporter.sendMail(emailOptions)
}

module.exports = sendMail;