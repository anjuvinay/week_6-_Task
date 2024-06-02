var express = require('express');
var router = express.Router();
const app=express()
const session=require('express-session')
const adminLogInCollection=require('../config/adminDB')
const logInCollection=require('../config/userDB')
var ObjectId = require('mongodb').ObjectId




/* GET users listing. */

router.get('/', function(req, res, next) {
  if(req.session.admin){
    res.redirect('/admin/home')
  }
  else{
    if(req.session.passwordwrong){
      res.render('admin/login',{msg:"invalid credentials"});
      req.session.passwordwrong=false
    }
  res.render('admin/login');
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
      res.redirect('/admin/')
    }
  }
  catch{
    res.send("Wrong details")
  }
});


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

router.get('/add-user', function(req, res, next) {
  admin=req.session.admin
  res.render('admin/add-user',{admin})
});

router.post('/add-user',async (req,res)=>{
  console.log(req.body)
  const data={
    name:req.body.username,
    email:req.body.Email,
    password:req.body.password
  }
  await logInCollection.insertMany([data])
  res.redirect('/admin/')
})

router.get('/delete-user/:id',async (req,res)=>{
  let proId=req.params.id
  console.log(proId)
  await logInCollection.deleteOne({ _id:new ObjectId(proId) })
    res.redirect('/admin/home')
})


router.get('/edit-user/:id', async (req,res)=>{
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

router.get('/log-out', function(req, res, next) {
  req.session.destroy()
  res.redirect('/admin/')
});


module.exports = router;
