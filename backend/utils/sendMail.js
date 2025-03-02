import nodemailer from 'nodemailer';


export default nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})