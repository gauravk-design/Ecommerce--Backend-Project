const bcrypt = require("bcryptjs")
const user_model = require("../models/user.model")
const jwt = require("jsonwebtoken")

const crypto = require("crypto")

const secret = require("../configs/auth.config")
const { default: mongoose, isValidObjectId } = require("mongoose")
const sendEmail = require("./email.controller")
const { request } = require("http")
const validateMongoDbId = require("../validationmongo/validatemongodb")

const signup = async (req, res)=>{
    /**
     * Logic to create the user
     */



    //1. read the request body

    const request_body = req.body




    //2. Insert the data in the user collection in mongoDB

    const userObj = {
        name : request_body.name,
        userId : request_body.userId,
        email : request_body.email,
        userType : request_body.userType,
        password : bcrypt.hashSync(request_body.password, 8),
        mobile : request_body.mobile,
        address:request_body.address,
        wishlist:request_body.wishlist
    }


    try{

       const user_created = await user_model.create(userObj)

       //Return this user

       const res_obj={
          name: user_created.name,
          userId : user_created.userId,
          email: user_created.email,
          mobile:user_created.mobile,
          address:user_created.address,
          wishlist:user_created.wishlist,
          userType: user_created.userType,
          createdAt: user_created.createdAt,
          updateedAt: user_created.updatedAt
       }

       res.status(201).send(res_obj)

    }catch(err){
        console.log("Error while registering the user", err)

        res.status(500).send({
            message : "Some error happened while registering the user"
        })
    }

    //3. return the response back to the user


}


const sigin= async (req, res)=>{
    //check if the userId is present in the system

    const user = await user_model.findOne({userId:req.body.userId})

    if(user==null){
        res.status(400).send({
            message : "UserId passed is not a valid UserId "
        })
    }



    //Password is Correct

    const isPasswordValid =  await bcrypt.compare(req.body.password, user.password)

    if(!isPasswordValid){
        return res.status(401).send({
            message : "Password Enterd is not valid  ?  Please try Again"
        })
    }



    //using jwt we will create the acess token with a given TTL and return

    const token = jwt.sign({id: user.userId}, secret.secret,{
        expiresIn : 120
    })

    res.status(200).send({
        name : user.name,
        userId : user.userId,
        email : user.email,
        userType : user.userType,
        acessToken : token
    })
}

     //update a user


const updateAUser = async (req, res)=>{
    const { id } = req.params;
    try{

        const updateUser = await user_model.findByIdAndUpdate(id, {
            name : req.body.name,
            userId : req.body.userId,
            email : req.body.email,
        }, {
            new : true,
        });
        res.json({updateUser,})

    }catch(err){

        console.log(err);
        res.status(400).send({
            message : "Error while Updating the user"
        })

    }
}


//get all users
const getAllUser = async (req, res) => {
    try{
        const getUsers = await user_model.find();
        res.json(getUsers)

    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Error while retriving the users"
        })
    }
}
     //get a single user

const getAuser = async (req, res) => {

    const  { id }  = req.params;
    try{

        const getUser = await user_model.findById(id);
        res.json(getUser)


    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "User Cannot Find wronge id"
        })
    }
}
    //delete a user

    const deleteAuser = async (req, res) => {

        const { id } = req.params;
        try{
    
            const deleteUser = await user_model.findByIdAndDelete(id);
            res.json({deleteUser,})
    
    
        }catch(err){
            console.log(err);
            res.status(500).send({
                message : "Error while deleting the user"
            })
        }
    }
const updatePassword = async (req, res)=>{
    const { _id } = req.user;
    const { password }= req.body;
    if(!mongoose.isValidObjectId(_id)){
        return res.status(400).json({error : "Invalid user id"})
    }
    const user = await user_model.findById(_id)
    if(password){
        user.password = password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    }else{
        res.json(user)
    }

}


const forgotPasswordToken = async (req, res) =>{
    const {email} = req.body;
    const user = await user_model.findOne({ email })

    if(!user){
        return res.status(404).send({
            message : "User not found with this email"
        })
    }

    try{
        const token = await user.createPasswordResetToken();
        await user.save()
        const resetURL = `Hi Please follow this link to reset your password. This link is valid till 10 minutes from now.<a href="http://localhost:8080/ecomm/api/v1/aut/reset-pasword/${token}">Click here</>`;
        const data = {
            to : email,
            text : "Hey user",
            subject : "Forgot Password Link",
            html : resetURL,
        }
        await sendEmail(data);
        res.json(token)

    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Internal server Error"
        })
    }


}

const resetPassword = async (req, res)=>{
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await user_model.findOne({
        passwordResetToken : hashedToken,
        passwordResetExpires : { $gte : Date.now()},
    })
    if(!user){
        return res.status(404).send({
            message : "Token Expired, Please try again later"
        })
    }

    user.password=password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save()

    res.json(user)
}



module.exports = {sigin, signup, updateAUser, getAllUser, getAuser,deleteAuser, updatePassword, forgotPasswordToken, resetPassword}