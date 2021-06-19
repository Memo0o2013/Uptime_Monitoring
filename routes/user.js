const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('Email Already Exists');
    user = new User({ name: req.body.name, email: req.body.email, password: req.body.password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    await user.save(()=>{
        const token = user.generateAuthToken();
        let transporter = nodemailer.createTransport({ service: 'Gmail', auth: { user: "mohamedabdelaal2013@gmail.com", pass: "vnakjsbjspkinwil" } });
        let mailOptions = { from: 'no-reply@test.com', to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '/verify?id=' + token  };
        transporter.sendMail(mailOptions, function (err) {
            if (err) { return res.status(500).send({ msg: err.message }); }
            res.status(200).send('A verification email has been sent to ' + user.email + '.');
    })
  })
});

router.get('/verify',async (req,res)=>{
    const token = req.query.id;
    if (token){
        jwt.verify(token,process.env.jwtPrivateKey,async(e,decoded)=>{
            if(e) return res.status(400).send(error.details[0].message)
            else{
                let user = await User.findOne({_id:decoded._id});
                user.isVerified = true;
                user.save();
                res.status(200).send('User Verified.')
            }
        })
    }
    else{
        return res.sendStatus(403)
    }


})

router.post('/login', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');
  
    if(!user.isVerified) return res.status(401).send('Account not Verified');
  
    const token = user.generateAuthToken();
    res.send(token);
  });

module.exports=router;