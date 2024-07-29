/**
 * name of category and description model
 */

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    title :{
        type : String,
        required : true,
        unique : true,
        index: true,
    },
},{timestamps : true, versionKey : false})


module.exports = mongoose.model("Pcategory", categorySchema)