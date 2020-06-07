const express = require('express');

const router = express.Router();

//Login page
router.get('/login',(req,res)=>{
    res.render('login');
})


//Register page
router.get('/register',(req,res)=>{
    res.render('register');
})

//Register handle
router.post('/register',(req,res)=>{
    const {name, email, password, password2} = req.body;
    let errors = [];

    //check require field
    if(!name || !email || !password || !password2){
        errors.push({msg:'please fill in all fields'});
    }
    if(password !== password2){
        errors.push({msg:'password do not match'});
    }
    if(password.length < 6){
        errors.push({msg:'password should be at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        res.send('pass');
    }
})


module.exports = router;