const nodemailer = require('nodemailer');
const axios = require('axios');
const Monitor = require('ping-monitor');

function sendMailNotifcation(user,site){
    let transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: process.env.Google_Email, pass: process.env.Google_Password } });
    let mailOptions = { from: process.env.From_Email, to: user.email, subject: site.website + ' Status Check', text: `Hello ${user.name},\n\n` + site.website +` Status is ${site.statusMessage}`};
    transporter.sendMail(mailOptions, (err) => {
        if (err) { return err }
    })
}

async function sendHookNotifcation(resCheck,webhook){
    const webHook = (webhook ==undefined) ? process.env.Hook_URL : webhook
    console.log(webhook)
    await axios.post(webHook,{
        site:resCheck.website,
        statusCode: resCheck.statusCode,
        status:resCheck.statusMessage
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
                sendMailNotifcation(user,resCheck);
                sendHookNotifcation(resCheck,check.webhook);
            })
            myMonitor.on('down', (resCheck)=> {
                sendMailNotifcation(user,resCheck);
                sendHookNotifcation(resCheck,check.webhook);
            });
            myMonitor.on('stop', (website)=> {
                sendMailNotifcation(user,website);
                sendHookNotifcation(resCheck,check.webhook);
            })
            myMonitor.on('error',(resCheck)=>{
                sendMailNotifcation(user,resCheck);
                sendHookNotifcation(resCheck,check.webhook);
            })
        }
        catch(e){
            return res.send(e)
        }
    });
}

exports.monitor = monitor;