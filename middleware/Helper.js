const nodemailer = require('nodemailer');
const axios = require('axios');
const Monitor = require('ping-monitor');

function sendMailNotifcation(user,site){
    let host = (site.website == undefined ? site.hostname : site.website)
    let statusMessage = (site.statusMessage == undefined ? 'error' : site.statusMessage)
    let transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.Google_Email, pass: process.env.Google_Password } });
    let mailOptions = { from: process.env.From_Email, to: user.email, subject: host + ' Status Check', text: `Hello ${user.name},\n\n` + host +` Status is ${statusMessage}`};
    transporter.sendMail(mailOptions, (err) => {
        if (err) { return err }
    })
}

async function sendHookNotifcation(resCheck,webhook){
    const webHook = (webhook ==undefined) ? process.env.Hook_URL : webhook
    let host = (resCheck.website == undefined ? resCheck.hostname : resCheck.website)
    let statusCode = (resCheck.statusCode == undefined ? resCheck.code : resCheck.statusCode)
    let statusMessage = (resCheck.statusMessage == undefined ? 'error' : resCheck.statusMessage)
    await axios.post(webHook,{
        site:host,
        statusCode: statusCode,
        status:statusMessage
    })
}

function monitor (user,checks){
    checks.forEach(check => {
        const myMonitor = new Monitor({
            website: check.url,
            title:check.name,
            interval:check.interval,
            config:check.config,
            port:check.port,
            ignoreSSL:check.ignoreSSL
        });
        try{
            myMonitor.on('up',async (resCheck)=>{
                if((check.checkStatus != "up") || (check.firstCheck == false)){
                    check.checkStatus = "up";
                    check.firstCheck = true;
                    check.save();
                    sendMailNotifcation(user,resCheck);
                    sendHookNotifcation(resCheck,check.webhook);
                }
            })
            myMonitor.on('down', (resCheck)=> {
                if((check.checkStatus != "down") || (check.firstCheck == false)){
                    check.checkStatus = "down";
                    check.firstCheck = true;
                    check.save();
                    sendMailNotifcation(user,resCheck);
                    sendHookNotifcation(resCheck,check.webhook);
                }
            });
            myMonitor.on('stop', (website)=> {
                if((check.checkStatus != "stop") || (check.firstCheck == false)){
                    check.checkStatus = "stop";
                    check.firstCheck = true;
                    check.save();
                    sendMailNotifcation(user,website);
                    sendHookNotifcation(resCheck,check.webhook);
                }
            })
            myMonitor.on('error',(resCheck)=>{
                if((check.checkStatus != "error") || (check.firstCheck == false)){
                    check.checkStatus = "error";
                    check.firstCheck = true;
                    check.save();
                    console.log(resCheck)
                    sendMailNotifcation(user,resCheck);
                    sendHookNotifcation(resCheck,check.webhook);
                }
            })
        }
        catch(e){
            return res.send(e)
        }
    });
}

exports.monitor = monitor;