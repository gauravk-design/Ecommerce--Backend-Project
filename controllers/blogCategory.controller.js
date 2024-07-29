const blogCat_model = require("../models/blogCat.model")
const validateMongoDbId = require("../validationmongo/validatemongodb")

//create new category for blog

const createNewBlogCat = async (req, res)=>{


    //read the request body


    //Create the category object

    const blogcCat_data = {
        title : req.body.title
    }

    try{
        //insert into mongoDb
        const blogCat = await blogCat_model.create(blogcCat_data)
        return res.status(201).send(blogCat)
    }catch(err){
        console.log("Error while creating the category", err);

        return res.status(500).send({
            message : "Error while creating the category"
       })

        
    }

}


const updatBlogeCategory = async (req, res)=>{

    const { id } = req.params;
    validateMongoDbId(id)
    try{
        const updateACategory = await blogCat_model.findByIdAndUpdate(id, req.body, {new : true})
        return res.status(201).send(updateACategory)
    }catch(err){
        console.log("Error while update the category", err);

        return res.status(500).send({
            message : "Error while update the category"
       })

        
    }

}


    //Delete a blog category

const deleteBlogCategory = async (req, res)=>{

        const { id } = req.params;
        validateMongoDbId(id)
        try{
            const deleteACategory = await blogCat_model.findByIdAndDelete(id)
            return res.status(201).send(deleteACategory)
        }catch(err){
            console.log("Error while Deleting the category", err);

            return res.status(500).send({

                message : "Error while Deleting the category"
        })
    
            
    }
    
}


    //Get All Blog Category


const getAllBlogCategory = async (req, res)=>{
        try{
            const getallCategory = await blogCat_model.find();
            res.json(getallCategory)
            
        }catch(err){
            console.log("Error while fetching the categories", err);
    
            return res.status(500).send({
                message : "Internal server Error"
        })
    
            
    }
    
}

          //Get a Single Blog Category

const getBlogCategory = async (req, res)=>{

        const { id } = req.params;
            validateMongoDbId(id)
        try{
                //insert into mongoDb
            const getACategory = await blogCat_model.findById(id)
             return res.status(201).send(getACategory)
        
        }catch(err){
            console.log("Error while fetching this category", err);
        
            return res.status(500).send({
                message : "Internal server Error"
        })
        
                
    }
}




module.exports = {
    createNewBlogCat,
    updatBlogeCategory,
    deleteBlogCategory,
    getAllBlogCategory,
    getBlogCategory
}