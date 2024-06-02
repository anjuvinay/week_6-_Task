const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/cartDB")
.then(()=>{
    console.log("mongodb connected")
})
.catch(()=>{
    console.log("failed to connect")
})


const adminLogInSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const adminLogInCollection=new mongoose.model("admin",adminLogInSchema)
module.exports=adminLogInCollection;