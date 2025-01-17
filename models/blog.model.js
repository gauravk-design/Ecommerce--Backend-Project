const mongoose = require("mongoose")

const user_model = require("./user.model")



const blogSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description: {
        type : String,
        required : true,
    },
    category: {
        type : String,
        required : true,
    },
    numViews: {
        type : Number,
        default : 0,
    },
    isLiked: {
        type : Boolean,
        default : false,
    },
    isDisLiked: {
        type : Boolean,
        default : false,
    },
    likes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
    ],
    disLikes:[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
    ],

    images: [],
    author: {
        type : String,
        default : "ADMIN",
    }, 

},{toJSON : {
    virtuals : true,
}, toObject : {
    virtuals : true,
}, timestamps : true})


module.exports = mongoose.model("Blog", blogSchema)