const coupon_model = require("../models/coupon.model");

const validateMongoDbId = require("../validationmongo/validatemongodb")



const createCoupon = async (req, res)=>{

    try{

        const newCoupon = await coupon_model.create(req.body);

        res.json(newCoupon)

    }catch(err){
        console.log("Error While creating the coupon ", err);
        return res.status(500).send({
            message : "Internal Server Error ! Please Try again later"
        })
    }

}


const getAllCoupon = async (req, res)=>{
    try{

        const getallcoupon = await coupon_model.find()

        res.json(getallcoupon)

    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Internal Server Error"
        })
    }
}

const updateCoupon = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{

        const updatecoupon = await coupon_model.findByIdAndUpdate(id, req.body, {new : true});

        res.json(updatecoupon)

    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Internal Server Error"
        })
    }
}

const deleteCoupon = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{

        const deletecoupon = await coupon_model.findByIdAndDelete(id);

        res.json(deletecoupon)

    }catch(err){
        console.log(err);
        return res.status(500).send({
            message : "Internal Server Error"
        })
    }
}









module.exports = {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    deleteCoupon
}