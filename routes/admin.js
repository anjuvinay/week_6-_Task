var express = require('express');
var router = express.Router();
const app=express()
const session=require('express-session')
const adminLogInCollection=require('../config/adminDB')
const logInCollection=require('../config/userDB')
var ObjectId = require('mongodb').ObjectId



const verifyAdminLogin = (req, res, next)=>{
  console.log(req.session.admin)
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin/')
  }
}


//admin login get and post methods

router.get('/', function(req, res, next) {
  if(req.session.admin){
    res.redirect('/admin/home')
  }
  else{
    if(req.session.passwordwrong){
      res.render('admin/login',{msg:"invalid credentials"});
      req.session.passwordwrong=false
    }
    else{
      res.render('admin/login');
    }
}
});


router.post('/login', async (req, res, next)=> {
  console.log(req.body)
  try{
    const check=await adminLogInCollection.findOne({name:req.body.name})
    console.log(check)

    if(check.password===req.body.password){
      req.session.admin=req.body.name
      res.redirect('/admin/home')
    }
    else{
      req.session.passwordwrong=true
      res.redirect('/admin/')
    }
  }
  catch{
    req.session.passwordwrong=true
    res.redirect('/admin/')
  }
});


//admin signup get and post methods

router.get('/signup', function(req, res, next) {
  res.render('admin/signup');
})


router.post('/signup', async (req, res, next)=> {
  console.log(req.body)
  const data={
    name:req.body.adminname,
    email:req.body.Email,
    password:req.body.password
  }
  await adminLogInCollection.insertMany([data])
  res.redirect('/admin/')

});


//admin home page

router.get('/home', async (req, res, next)=> {

   const people=await logInCollection.find().lean()
   console.log("people:"+people)
   
   if(req.session.admin){
    admin=req.session.admin
    res.render('admin/view-products',{people,admin})
  }
  else{
    if(req.session.passwordwrong){
      req.session.passwordwrong=false
      res.render('user/login',{msg:"invalid credentials"});
    }
    else{
      res.render('user/login');
    }
  
}
});

// add user get and post methods 

router.get('/add-user', verifyAdminLogin, function(req, res, next) {
  admin=req.session.admin
  if(admin){
    res.render('admin/add-user',{admin})
  }
  else{
    res.redirect('/admin/')
  }
  
});

router.post('/add-user',verifyAdminLogin, async (req,res)=>{
  console.log(req.body)
  const data={
    name:req.body.username,
    email:req.body.Email,
    password:req.body.password
  }
  await logInCollection.insertMany([data])
  res.redirect('/admin/')
})

// delete user

router.get('/delete-user/:id', verifyAdminLogin ,async (req,res)=>{
  let proId=req.params.id
  console.log(proId)
  await logInCollection.deleteOne({ _id:new ObjectId(proId) })
    res.redirect('/admin/home')
})

// edit user get and post method

router.get('/edit-user/:id', verifyAdminLogin, async (req,res)=>{
  admin=req.session.admin
  let proId=req.params.id
  const user=await logInCollection.findOne({ _id:new ObjectId(proId) }).lean()
  console.log(user)
  res.render('admin/edit-user',{admin,user})
})

router.post('/edit-user/:id',async (req,res)=>{
  admin=req.session.admin
  let proId=req.params.id
  console.log(req.body)
  const data={
    name:req.body.username,
    email:req.body.Email,
    password:req.body.password
  }
  await logInCollection.updateOne({ _id:new ObjectId(proId) },{ $set: data })
    res.redirect('/admin/home')
})

// admin logout

router.get('/log-out', function(req, res, next) {
  req.session.destroy()
  res.redirect('/admin/')
});


module.exports = router;
