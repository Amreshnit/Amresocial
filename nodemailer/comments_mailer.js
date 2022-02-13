const nodeMailer = require('../config/nodemailer');
const nodemailer = require('../config/nodemailer');

exports.newComment = (comment) => {
    console.log('Inside newComment mailer',comment);

    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');

    nodeMailer.transporter.sendMail({
        from : 'harshv521@gmail.com',
        to : comment.user.email,
        subject : 'New Comment',
        html : htmlString
    }, (err,info) => {
        if(err){
            console.log('error in sending mail',err);
            return;
        }
        console.log('Message Sent',info);
        return;
    });
}