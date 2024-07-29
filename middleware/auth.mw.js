const user_model=require("../models/user.model")

const jwt = require("jsonwebtoken")
const auth_config = require("../configs/auth.config")

/**
 * create a middleware to check the  if the request body is proper and correct
 */

const verifySignupBody = async (req, res, next)=>{
    try{

        //check for the name

        if(!req.body.name){
            return res.status(400).send({
                message : "Failed ! Name was not provided in request body "
            })
        }


        //check for the email
        if(!req.body.email){
            return res.status(400).send({
                message : "Failed ! Email was not provided in request body "
            })
        }

        //check for userId

        if(!req.body.userId){
            return res.status(400).send({
                message : "Failed ! UserId was not provided in request body "
            })
        }

        if(!req.body.mobile){
            return res.status(400).send({
                message : "Mobile number was not provided"
            })
        }

        //check if the user with  the same userId is already present

        const user = await user_model.findOne({userId : req.body.userId})

        if(user){
            return res.status(400).send({
                message : "Failed ! User with same userId is allready present "
           })
            
        }

        next()



    }catch(err){
        console.log("Error while validating the request object ", err);

        res.status(500).send({
            message : "Error while validating the request object"
        })
    }
}

const verifySigninBody = async (req, res, next)=>{
    if(!req.body.userId){
        return res.status(400).send({
            message:"UserId is not provided"
        })
    }
    if(!req.body.password){
        return res.status(400).send({
            message:"Password is not provided"
        })
    }
    next()
    
}
const verifyToken = (req, res, next)=>{
    //check if the token is present in the header

    const token = req.headers['x-access-token']

    if(!token){
        return res.status(403).send({
            message : "No tokens Found : UnAuthorized"

        })
    }


    //if it is valid token

    jwt.verify(token,auth_config.secret, async (err, decoded)=>{
        if(err){
            return res.status(401).send({
                message : "UnAuthorized"
            })
        }

        const user = await user_model.findOne({userId : decoded.id})

        if(!user){
            return res.status(401).send({
                message : "UnAuthorized, this user for this token doesnt exist "
            })
        }

        //set the user info in request body

        req.user = user
        next()
    })
    //Then move to the next step
}
const isAdmin = (req, res, next)=>{
    const user = req.user

    if(user && user.userType == "ADMIN"){
        next()
    }else{
        return res.status(403).send({
            message : "Only Admin users are allowed to access this endpoints"
        })
    }
}





module.exports={
    verifySignupBody: verifySignupBody,
    verifySigninBody: verifySigninBody,
    verifyToken : verifyToken,
    isAdmin : isAdmin
}