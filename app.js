var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session=require('express-session')
const nocache=require('nocache')
var hbs=require('express-handlebars')
var fileUpload = require('express-fileupload')
const mongoose=require('mongoose')


var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();

// connect to mongoDB
mongoose.connect("mongodb://127.0.0.1:27017/nodejs")

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",function(){
  console.log("MongoDB Connection Succesfull")
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs.engine({extname:'hbs',
defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload())

app.use(session({
  secret:"keyboard cat",
  resave:true,
  saveUninitialized:false,
  cookie:{
    sameSite:'strict',
    maxAge:60*1000*60
  }
}))


app.use(nocache());


app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
