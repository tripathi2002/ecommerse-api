const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const asyncHandler = require('express-async-handler');


const sendEmail = asyncHandler(async (data, req, res)=>{
    console.log("sendEmail");

    const {email, name, subject, token } = data;
    // const {name, email } = req.user;


    // const { token, subject } = data;
    // const { token } = req.token;
    // const { subject } = req.body;

    let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.E_PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Bajoo",
            link: 'http://instagram.com/brahman.vibhu.tripathi?igshid=ZDdkNTZiNTM=',
            copyright: 'Copyright @2023 Bajoo. All rights reserved.'
        }
    });

    let response = {
        body: {
            name,
            greeting: 'Dear',
            signature: 'yours truly',
            title:'Forget Password',
            intro: ['Welcome to Bajoo!', 
            'We\'re very excited to have you on board.',
            `${token}`
            ],
            action: {
                instructions: 'For reset the password, please click here:',
                button: {
                    color: 'blue',
                    text: 'change password', 
                    link: `http://127.0.0.1:1000/api/user/reset-password/${token}`
                                }
            },
            dictionary: {
                date: Date(),
                address:'ICCS PUNE'
            },

            outro: 'thanks for visiting...!'
        }
    };

    let mail = MailGenerator.generate(response);

    let message = {
        from: process.env.EMAIL,
        to: email,
        subject: subject || '_sub',
        html: mail
    }

    transporter.sendMail(message)
        .then(info =>{
            // return res.json(info.messageId);
            console.log(info.messageId);
        }).catch(err=>{
            throw new Error(err);
        });   
});


module.exports = {
    sendEmail
}