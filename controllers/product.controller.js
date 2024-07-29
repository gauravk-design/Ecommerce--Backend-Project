const { default: slugify } = require("slugify");
const product_model = require("../models/product.model");
const user_model = require("../models/user.model");
const validateMongoDbId = require("../validationmongo/validatemongodb");
const cloudinaryUploadImg = require("../validationmongo/cloudinary")
const fs = require("fs")



/**
 * controller for creating the new product
 * Post localhost:8080/ecomm/api/v1/auth/products
 */

const createNewProduct = async (req, res)=>{
    //read the req body
    //create the product object

    const pro_data = {
        title : req.body.title,
        slug : req.body.title,
        description : req.body.description,
        price : req.body.price,
        category : req.body.category,
        brand : req.body.brand,
        colour : req.body.colour,
        quantity : req.body.quantity,
        sold : req.body.sold,
        images : req.body.images,
    }
    const slugify = require("slugify")
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        //insert into mongoDb
        const  product = await product_model.create(pro_data)
        return res.status(201).send(product)
    }catch(err){
        console.log("Error while creating the product", err);
        return res.status(500).send({
            message : "Error while creating the product"
        })
    }



   // return the response to the created product
}

const updateProduct = async (req, res)=>{
    const productId = req.params.id;
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);

        }

        const updateProduct = await product_model.findByIdAndUpdate(productId, req.body, {
            new : true,
        });
        return res.status(201).send(updateProduct)

    }catch(err){
        console.log("Error to update product", err);
        return res.status(500).send({
            message : "Error while update the product"
        })
    }
}
const deleteProduct = async (req, res)=>{
    const id = req.params.id;
    try{
        const deleteProduct = await product_model.findByIdAndDelete(id)
        return res.status(204).send(deleteProduct)

    }catch(err){
        console.log("Error to delete product", err);
        return res.status(500).send({
            message : "Error while deleting the product"
        })
    }
}


   const getAProduct = async (req, res)=>{
    const {id} = req.params;
    try{
        const findProduct = await product_model.findById(id)
        return res.status(201).send(findProduct)

    }catch(err){
        console.log("Error while finding the product", err);
        return res.status(500).send({
            message : "Error while finding the product"
        })

    }
}

   const getAllProduct = async (req, res)=>{
    try{
        //filtering product
        const queryObj = {...req.query}

        const excludeFields = ["page", "sort", "limit", "fields"]

        excludeFields.forEach((el)=> delete queryObj[el])


        let queryStr = JSON.stringify(queryObj)

        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g , (match)=> `$${match}`)

        let query = product_model.find(JSON.parse(queryStr))
        
        //sorting the product

        if(req.query.sort){
            const sortBy = req.query.sort.split(",").join(" ")
            query = query.sort(sortBy)
        }else{
            query = query.sort("-createdAt")
        }

        //Limiting the fields

        
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        }else{
            query = query.select("-__v")
        }

        //pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1)*limit;

        query = query.skip(skip).limit(limit);

        if(req.query.page){
            const productCount = await product_model.countDocuments();
            if(skip >= productCount) throw new Error("This page does not exist")
        }




        const findAllProduct = await query;
        return res.status(201).send(findAllProduct)

     }catch(err){
        console.log("Error to find all product", err);
        return res.status(500).send({
            message : "Error while finding all the product"
        })
    }
}


//Add to wishlist

const addToWishlist = async (req, res)=>{
    const {_id } = req.user;

    const { prodId } = req.body;

    try{

        const user = await user_model.findById(_id)
        const allreadyAdded = user.wishlist.find((id)=> id.toString() === prodId)

        if(allreadyAdded){
            let user = await user_model.findByIdAndUpdate(
                _id,
                {
                    $pull : {wishlist : prodId},
                },
                {
                    new : true,
                }
        )

            res.json(user)
        }else{

            let user = await user_model.findByIdAndUpdate(
                _id,
                {
                    $push : {wishlist : prodId},
                },
                {
                    new : true,
                }



        )

        res.json(user)

        }

    }catch(err){
        console.log("Erroe while adding product to Wishlist", err);
        return res.status(500).send({
            message : "Internal Server Error ! Please try again"
        })

    }
}


const rating = async (req, res)=>{
    const { _id } = req.user;

    const { star, prodId, comment } = req.body;
    try{
        const product =  await product_model.findById(prodId)

        let alReadyRated = product.ratings.find(
            (userId) => userId.postedby.toString() === _id.toString());

        if(alReadyRated){

            const updateRating = await product_model.updateOne(
                {
                   ratings : { $elemMatch: alReadyRated },
                },
                {
                    $set : {"ratings.$.star":star, "ratings.$.comment" : comment},
                },
                {
                    new : true,
                }
           );

        }
        else{
            const rateProduct = await product_model.findByIdAndUpdate(
                prodId, 
                {
                $push : {
                    ratings : {
                        star : star,
                        comment : comment,
                        postedby : _id,
                    }
                }
            }, {new : true})
        }

        const getAllRatings = await product_model.findById(prodId);

        const totalRating = getAllRatings.ratings.length;

        let ratingSum = getAllRatings.ratings.map((item)=>item.star)
        .reduce((curr, next)=> curr+next, 0)

        let actualRating = Math.round(ratingSum/totalRating);

        let finalProduct = await product_model.findByIdAndUpdate(
            prodId,
            {
                totalrating : actualRating,
            },
            {
                new : true,
            }

        );

        res.json(finalProduct);





    }catch(err){
        console.log("Error to fetch", err);

        return res.status(500).send({
            message: "Internal server Error ! Please Try Again"
        })
    }
}

const uploadImages = async (req, res)=>{
    const { id } = req.params;
    validateMongoDbId(id)

    try {

        const uploader = (path)=> cloudinaryUploadImg(path, "images")
        const urls = [];
        const files = req.files;

        for(const file of files){
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath)
           
        }

        const findProduct = await product_model.findByIdAndUpdate(id, {
            images : urls.map((file)=>{
                return file;
            })
        }, { new : true})

        res.json(findProduct)

        
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message : "Internal Server Error"
        })
        
    }


}


  

module.exports = {
    createNewProduct,
     getAProduct,
     updateProduct,
      getAllProduct,
      deleteProduct,
      addToWishlist,
      rating,
      uploadImages
    }