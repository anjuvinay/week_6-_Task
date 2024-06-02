var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
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
  res.render('admin/view-products',{items,admin:true})
});

router.get('/add-product', function(req, res, next) {
  res.render('admin/add-product',{admin:true})
});

// router.post('/add-product',(req,res)=>{

//   productHelpers.addProduct(req.body,(insertedId)=>{
//     let image=req.files.Image
       
//     image.mv('./public/product-images/'+insertedId+'.jpg',(err,done)=>{
      
//       if(!err){
//         res.redirect('/admin/view-products')
//       }else{
//         console.log(err)
//       }
//     })
    
//   })
// })

router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)
})



module.exports = router;
