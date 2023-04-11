import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT,
    mongoURL: process.env.MONGO_URL,
    adminEmail: process.env.ADMIN_NAME,
    adminPass: process.env.ADMIN_PASSWORD,
    userNodemailer : process.env.USER_MAIL,
    passNodemailer : process.env.PASS_MAIL
}