const mongooose=require("mongoose")


const customerSchema=new mongooose.Schema({
    full_name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact_no:{
        type:String,
        required:true
    }
})

const Customer=mongooose.model("customers",customerSchema);

module.exports=Customer;