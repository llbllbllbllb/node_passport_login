const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// user model
const User = require('./../models/User');

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
        // validation passed
        User.findOne({ email:email}).then(user => {
            if(user){
                //user already exits
                errors.push({msg: 'Email is already registered.'});
                res.render('register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else{
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });

                // hash password
                bcrypt.genSalt(10, (err,salt)=> bcrypt.hash(newUser.password,salt, (err,hash)=>{
                    if(err) throw err;
                    // set password to hash
                    newUser.password = hash;
                    //save user
                    newUser.save()
                        .then(user=>{
                            req.flash('success_msg',"You are now registered and can log in.")
                            res.redirect('/user/login');
                        })
                        .catch(err=> console.log(err));

                }))
            }
        })
    }
})

//Login handle
router.post('/login',(req,res,next) =>{
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req,res,next);
})

//Logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/user/login');

});


module.exports = router;