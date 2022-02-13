const nodemailer = require('nodemailer');
const env = require('./environment');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data,relativePath) => {
    let mailHtml;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering mail',err);
                return;
            }

            mailHtml = template
        }
    )

    return mailHtml;
}

module.exports = {
    transporter : transporter,
    renderTemplate : renderTemplate
}