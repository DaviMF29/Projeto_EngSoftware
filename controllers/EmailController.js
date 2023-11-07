const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const config = require("../../config");
const User = require("../models/User");
const Group = require("../models/Group");
const Notification = require("../models/Notification");
const bcryptjs = require("bcryptjs");

const OAuth2_client = new OAuth2(config.clientId, config.clientSecret);
OAuth2_client.setCredentials({ refresh_token: config.refreshToken })

module.exports = {
    async sendContact(req, res) {
        let data = req.body;
        const accessToken = OAuth2_client.getAccessToken();
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                refreshToken: config.refreshToken,
                accessToken: accessToken
            }
        })

        let emailSend={
            from: {User},
            to: "",  //EMAIL NÃO INFORMADO
            subject: data.subject,
            html: `
            <h1>Mensagem de ${data.username} <${req.body.email}></h1>
            <h3>${data.message}</h3>
            `
        }

        await transporter.sendMail(emailSend, (error, response) => {
            if(error){
                res.send(error);
            } else {
                res.send("Mensagem enviada");
            }
            transporter.close();
        })

    },
    
}