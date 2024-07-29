const category_model = require("../models/prodcategory.model")
const validateMongoDbId = require("../validationmongo/validatemongodb")

/**
 * create the category through
 * POST - localhost:8080/ecomm/api/v1/auth/categories
 * {
      
      "name" : "Household",
      "description" : "This will have  all the household items"

    }
 */

const createNewCategory = async (req, res)=>{


    //read the request body


    //Create the category object

    const cat_data = {
        title : req.body.title
    }

    try{
        //insert into mongoDb
        const category = await category_model.create(cat_data)
        return res.status(201).send(category)
    }catch(err){
        console.log("Error while creating the category", err);

        return res.status(500).send({
            message : "Error while creating the category"
       })

        
    }


}



const updateCategory = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const updateACategory = await category_model.findByIdAndUpdate(id, req.body, {new : true})
        return res.status(201).send(updateACategory)
    }catch(err){
        console.log("Error while update the category", err);

        return res.status(500).send({
            message : "Error while update the category"
       })

        
    }

}

const deleteCategory = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const deleteACategory = await category_model.findByIdAndDelete(id)
        return res.status(201).send(deleteACategory)
    }catch(err){
        console.log("Error while Deleting the category", err);

        return res.status(500).send({
            message : "Error while Deleting the category"
       })

        
    }

}
const getAllCategory = async (req, res)=>{
    try{
        const getallCategory = await category_model.find();
        res.json(getallCategory)
        
    }catch(err){
        console.log("Error while fetching the categories", err);

        return res.status(500).send({
            message : "Internal server Error"
       })

        
    }

}
const getCategory = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        //insert into mongoDb
        const getACategory = await category_model.findById(id)
        return res.status(201).send(getACategory)
    }catch(err){
        console.log("Error while fetching this category", err);

        return res.status(500).send({
            message : "Internal server Error"
       })

        
    }
}





module.exports = {
    createNewCategory,
    updateCategory,
    deleteCategory,
    getAllCategory,
    getCategory
    
}
