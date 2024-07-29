
const mongoose = require("mongoose");

const blogCategorySchema = new mongoose.Schema({
    title :{
        type : String,
        required : true,
        unique : true,
        index: true,
    },
},{timestamps : true, versionKey : false})


module.exports = mongoose.model("Bcategory", blogCategorySchema)