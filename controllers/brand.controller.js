const brand_model = require("../models/brand.model")
const validateMongoDbId = require("../validationmongo/validatemongodb")


const createNewBrand = async (req, res)=>{


    //read the request body


    //Create the category object

    const brand_data = {
        title : req.body.title
    }

    try{
        //insert into mongoDb
        const brand = await brand_model.create(brand_data)
        return res.status(201).send(brand)
    }catch(err){
        console.log("Error while creating the Brand", err);

        return res.status(500).send({
            message : "Internal server Error"
       })

        
    }


}


   //update A Brand

   const updateBrand = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const updateABrand = await brand_model.findByIdAndUpdate(id, req.body, {new : true})
        return res.status(201).send(updateABrand)
    }catch(err){
        console.log("Error while update the Brand", err);

        return res.status(500).send({
            message : "Internal Server Error ! Please try gain Later"
       })

        
    }

}


//Delete A brand

const deleteBrand = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const deleteABrand = await brand_model.findByIdAndDelete(id)
        return res.status(201).send(deleteABrand)
    }catch(err){
        console.log("Error while Deleting the Brand", err);

        return res.status(500).send({
            message : "Internal Server Error"
       })

        
    }

}

//Get All Brands

const getAllBrands = async (req, res)=>{
    try{
        const getallbrands = await brand_model.find();
        res.json(getallbrands)
        
    }catch(err){
        console.log("Error while fetching the Brands", err);

        return res.status(500).send({
            message : "Internal server Error"
       })

        
    }

}

//Fetch A Single brand


const getBrand = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        //insert into mongoDb
        const getABrand = await brand_model.findById(id)
        return res.status(201).send(getABrand)
    }catch(err){
        console.log("Error while fetching this Brand", err);

        return res.status(500).send({
            message : "Internal server Error"
       })

        
    }
}




module.exports = {
    createNewBrand,
    updateBrand,
    deleteBrand,
    getAllBrands,
    getBrand
}

