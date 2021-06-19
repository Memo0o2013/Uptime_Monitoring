const {Check, validate} = require('../models/check');
const { User } = require('../models/user');
const { monitor} = require('../middleware/Helper')
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:name',auth,async (req,res)=>{
    const check = await Check.find({name:req.params.name})
    if(!check) return res.status(400).send('Invalid CheckName.');
    
    const user = await User.findById(req.user._id)

    monitor(user,check)
})

router.get('/bulk/:tag',auth,async(req,res)=>{
    const checks = await Check.find({tag:req.params.tag})
    if(!checks) return res.status(400).send('Invalid TagName.');

    const user = await User.findById(req.user._id)

    monitor(user,checks)
})

router.post('/',auth, async (req,res)=>{
    try {
        const { error } = validate(req.body);
        if(error) return res.status(400).send(error.details[0].message);

        req.body.userId =  req.user._id;

        const check = await Check.create(req.body);
        res.status(200).json({
            status:'success',
            check
        })
    }
    catch(e){
        res.status(400).send("Name must be Unique")
    }
})

router.delete('/:id',auth,async (req,res)=>{
    try{
        const check = await Check.findByIdAndRemove(req.params.id)
        if(!check) return res.status(404).send('Check with the given Id not Found')
        res.send(check)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.put('/:id',auth,async (req,res)=>{
    try{
        const updates = Object.keys(req.body);
        const check = await Check.findById(req.params.id)
        if(!check) return res.status(404).send('Check with the given Id not Found')
        const duplicated = await Check.find({name:req.body.name})
        if(typeof(duplicated) == Check) return res.status(404).send('Name already Exists')
        updates.forEach((u)=>{
            if(u != "userId")
            check[u] = req.body[u]
        })
        await check.save()
        res.send(check)
    }
    catch(e){
        res.status(400).send(e)
    }
})

module.exports=router;
