const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/cartDB")
.then(()=>{
    console.log("User connected to database")
})
.catch(()=>{
    console.log("failed to connect")
})


const logInSchema=new mongoose.Schema({
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

const logInCollection=new mongoose.model("users",logInSchema)
module.exports=logInCollection;