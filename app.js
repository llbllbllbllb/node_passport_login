const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');

const app = express();

//DB config
const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log('MongoDB connected.'))
.catch(err=>console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//Body Parser
app.use(express.urlencoded({extended:false}));

//Routes
app.use('/',require('./routes/index'));
app.use('/user',require('./routes/user'));


const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`server started on port ${PORT}`));