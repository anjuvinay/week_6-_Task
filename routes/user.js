var express = require('express');
var router = express.Router();
const app=express()
const session=require('express-session')
const logInCollection=require('../config/userDB')


const verifyUserLogin = (req, res, next)=>{
  console.log(req.session.user)
  if(req.session.user){
    next()
  }else{
    res.redirect('/')
  }
}

/* GET home page. */
router.get('/', async (req, res, next)=> {
  if(req.session.user){
    res.redirect('/home')
  }
  else{
    if(req.session.passwordwrong){
      res.render('user/login',{msg:"invalid credentials"});
      req.session.passwordwrong=false
    }
   else{
    res.render('user/login');
   }
}
});


router.post('/login', async (req, res, next)=> {
  console.log(req.body)
  try{
    const check=await logInCollection.findOne({name:req.body.name})
    console.log(check)

    if(check.password===req.body.password){
      req.session.user=req.body.name
      res.redirect('/home')
    }
    else{
      req.session.passwordwrong=true
      res.redirect('/')
    }
  }
  catch{
    req.session.passwordwrong=true
    res.redirect('/')
  }
});


router.get('/signup', function(req, res, next) {
  res.render('user/signup');
})


router.post('/signup', async (req, res, next)=> {
  console.log(req.body)
  const data={
    name:req.body.username,
    email:req.body.Email,
    password:req.body.password
  }
  await logInCollection.insertMany([data])
  res.redirect('/')

});


router.get('/home', verifyUserLogin, function(req, res, next) {
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
  
    user=req.session.user
    res.render('user/index',{items,user,admin:false})

});

router.get('/logout', function(req, res, next) {
  req.session.destroy()
  res.redirect('/')
});

module.exports = router;
