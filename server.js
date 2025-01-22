/**
 * This is the starting file of project
 */

//connection with express
const express = require("express")
//connection with mongoose
const mongoose = require("mongoose")

const dotenv = require("dotenv").config();

//define express as a function

const app = express()

// import user model
const user_model = require("./models/user.model")

//import bycrypt dependencies

const bcrypt = require("bcryptjs")

const morgan = require("morgan");
const bodyParser = require("body-parser");

//to convert json to js object - Middleware

app.use(express.json())
app.use(morgan("dev"))


/**
 * create an Admin user at the starting of the Application
 * if not already present
 */



// define funtion
async function init(){
    // write code for getting user

    //check if user is persent
    try{
        let user = await user_model.findOne({userId : "admin"})

        if(user){
           console.log("Admin is already present")
           return
        }

    }catch(err){
        console.log("Error while reading the data", err)
    }


    try{
        
        user = await user_model.create({
            name : "Gaurav kumar",
            userId : "admin",
            email : "gauravkumar181297@gmail.com",
            userType : "ADMIN",
            mobile : 9155912741,
            password : bcrypt.hashSync("Welcome1", 8)
        })

        console.log("Admin created", user)

    }catch(err){
        console.log("Error while create admin", err)
    }
}
/**
 * Stich the route to the srver
 */
require("./routes/auth.routes")(app)
require("./routes/prodcategory.routes")(app)
require("./routes/product.routes")(app)
require("./routes/blog.routes")(app)
require("./routes/blogCat.routes")(app)
require("./routes/brand.routes")(app)
require("./routes/coupon.routes")(app)


//Connect to mongoDb

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log("Error while connecting to MongoDB", err)
})


/**
 * Start the server
*/

app.listen(process.env.PORT, () => {
    console.log("Server Started at Port num", process.env.PORT);
})