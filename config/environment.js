
const fs = require('fs');
const path = require('path');
const rfs = require('rotating-file-stream');

const logDirectory = path.join(__dirname,'../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogstream = rfs.createStream('access.log',{
    interval : '1d',
    path : logDirectory
});


const development = {
    name : 'development',
    asset_path : './assets',
    session_cookie_key : 'blahsomething',
    db: 'codeial_development',
    smtp : {
        service : 'gmail',
        host : 'smpt.gmail.com',
        port: 587,
        secure: false,
        auth : {
            user : 'Amresh594',
            pass : '***'//hidden for sometime
        }
    },
    google_client_id : "444118020441-dsvdkhhurr1qh5guncmekic6h647g7ha.apps.googleusercontent.com",
    google_client_secret : "EVoeFUxUGtrkhDhlJt8dMsZ4",
    google_call_back_url : "http://localhost:8000/users/auth/google/callback",
    github_cal_back_url : "http://localhost:8000/users/auth/github/callback",
    jwt_secret : 'Amresocial',
    morgan : {
        mode : 'dev',
        options : {stream : accessLogstream}
    }
}

const production = {
    name : 'production',
    asset_path : process.env.SOCIALARRAY_ASSET_PATH,
    session_cookie_key : process.env.SOCIALARRAY_SESSION_COOKIE_KEY,
    db: process.env.SOCIALARRAY_DB,
    smtp : {
        service : 'gmail',
        host : 'smpt.gmail.com',
        port: 587,
        secure: false,
        auth : {
            user : process.env.SOCIALARRAY_GMAIL_USERNAME,
            pass : '***'//hidden for sometime
        }
    },
    google_client_id : process.env.SOCIALARRAY_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.SOCIALARRAY_GOOGLE_CLIENT_SECRET,
    google_call_back_url : "http://amresocial.co.in/users/auth/google/callback",
    github_cal_back_url : "http://amresocial.co.in/users/auth/github/callback",
    jwt_secret : process.env.SOCIALARRAY_JWT_SECRET,
    morgan : {
        mode : 'combined',
        options : {stream : accessLogstream}
    }
}

module.exports = eval(process.env.SOCIALARRAY_ENVIRONMENT) == undefined ? development : eval(process.env.SOCIALARRAY_ENVIRONMENT);