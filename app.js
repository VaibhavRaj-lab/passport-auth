const express = require(`express`)

const app = express();

const expressLayouts = require(`express-ejs-layouts`)
 
const mongoose = require(`mongoose`)
const passport = require('passport');

const bodyparser = require(`body-parser`)
const flash = require('connect-flash');
const session = require('express-session');
require('dotenv').config() 
console.log(process.env)

const api = process.env.Mongo_Api ;
// Passport Config
require('./config/passport')(passport);
// db config 
const db = require(`./config/key`).MongoURI;
// connect mongo 
mongoose.connect( api
, {useNewUrlParser:true , useUnifiedTopology: true   })
.then(()=>console.log("..mongo connected"))
.catch(err=> console.log(err)) ;


// EJS
app.use(expressLayouts)
app.set(`view engine`, `ejs`)

// bodyparser
app.use( bodyparser.urlencoded({extended: true}))
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
// routes  
const index = require(`./Routes/index.js`)
const users = require(`./Routes/users.js`)

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
const PORT= process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`server is listening at ${PORT}`)})

