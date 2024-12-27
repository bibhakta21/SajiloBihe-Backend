const express=require("express")
const router=express.Router();
const {findAll, save,findById,deleteById,update} = require("../controller/CustomerController");
const CustomerValidation=require("../validation/CustomerValidation")

router.get("/",  findAll);
router.post("/",CustomerValidation, save);
router.get("/:id",findById)
router.delete("/:id",deleteById)
router.put("/:id",update)



module.exports=router;