// add mongoose
const mongoose = require("mongoose")

const bcrypt = require("bcryptjs")

const crypto = require("crypto")


/**
 * Define user Schema to Track -
 *  name
 * userId
 * password
 * email
 * userType
 */

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userId : {
        type : String,
        required : true,
        unique : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        minLength : 10,
        unique : true
    },
    mobile : {
        type : Number,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    userType : {
        type : String,
        default : "CUSTOMER",
        enum : ["CUSTOMER", "ADMIN"]
    },
    cart :{
        type : Array,
        default : []
    },
    address : [{type : mongoose.Schema.Types.ObjectId, ref : "address"}],
    wishlist : [{type : mongoose.Schema.Types.ObjectId, ref: "product"}],
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date
},{timestamps : true})

userSchema.pre("save", async function (next){
    if(this.isNew || this.isModified("password")){
        const salt = await bcrypt.genSaltSync(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSchema.method.isPasswordMatched = async function(enteredPasswor){
    return await bcrypt.compare(enteredPasswor, this.password)
}

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resettoken).digest("hex")
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000 //10minutes
    return resettoken
}




module.exports = mongoose.model("User", userSchema)