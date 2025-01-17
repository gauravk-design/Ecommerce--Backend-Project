const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
        trim : true

    },
    slug :{
        type : String,
        unique : true,
        lowercase : true
        
    },
    description : {
        type : String,
        required : true
    },
    price :{
        type : Number,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    brand : {
        type : String,
        required : true
    },
    colour : {
        type: String,
        required: true
    },
    quantity :{
        type : Number,
        required : true,
        select : false
    },
    sold : {
        type : Number,
        default : 0,
        select :false
    },
    images :[],

    ratings : [
        {
        star : Number,
        comment : String,
        postedby : {type : mongoose.Schema.Types.ObjectId, ref : "User"}
    
    },
],
    totalrating : {
        type : String,
        default : 0,
    },

},{timestamps : true, versionKey : false})

module.exports = mongoose.model("product", productSchema)