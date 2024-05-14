var express = require('express');
var router = express.Router();
const app=express()
const session=require('express-session')


const username="anju"
const password="12345"


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.redirect('/home')
  }
  else{
    if(req.session.passwordwrong){
      res.render('login',{msg:"invalid credentials"});
      req.session.passwordwrong=false
    }
  res.render('login');
}
});

router.post('/login', function(req, res, next) {
  console.log(req.body)
  if(req.body.username===username && req.body.password===password){
    req.session.user=req.body.username
    res.redirect('/home')
  }
  else{
    req.session.passwordwrong=true
    res.redirect('/')
  }
});

router.get('/home', function(req, res, next) {
  let items=[{
    image:'/images/iphone 15.jpeg',
    name:"Iphone 15",
    category: "phone",
    description:"256 GB",
    price:86000
   },
   {
    image:'/images/dell.jpeg',
    name:"Dell Inspiron",
    category: "Laptop",
    description:"i5 processor",
    price:62000
   },
   {
    image:'/images/head.jpeg',
    name:"jabra",
    category: "Head Phone",
    description:"bluetooth",
    price:18000
   },
   {
    image:'/images/iphone14.jpeg',
    name:"Iphone 14",
    category: "phone",
    description:"512 GB",
    price:18000
   },]
  if(req.session.user){
    user=req.session.user
    res.render('index',{items,user})
  }
  else{
    if(req.session.passwordwrong){
      req.session.passwordwrong=false
      res.render('login',{msg:"invalid credentials"});
    }
    else{
      res.render('login');
    }
  
}
});

router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/')
});

module.exports = router;
