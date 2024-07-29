/**
 * POST call to this -  localhost:8080/ecomm/api/auth/signup
 *  I nees to intercept this
 */

const authController = require("../controllers/auth.controller")

const authMw=require("../middleware/auth.mw")

module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/signup",[authMw.verifySignupBody], authController.signup),



    app.put("/ecomm/api/v1/auth/password", [authMw.verifyToken], authController.updatePassword),

    app.post("/ecomm/api/v1/auth/forgot-password-token", authController.forgotPasswordToken),
    app.put("/ecomm/api/v1/aut/reset-pasword/:token", authController.resetPassword),
    app.post("/ecomm/api/v1/auth/sigin" ,[authMw.verifySigninBody], authController.sigin),
    app.put("/ecomm/api/v1/auth/:id", authController.updateAUser),

    app.get("/ecomm/api/v1/auth/getallusers", [authMw.verifyToken, authMw.isAdmin], authController.getAllUser),
    app.get("/ecomm/api/v1/auth/:id", [authMw.verifyToken, authMw.isAdmin], authController.getAuser),
    app.delete("/ecomm/api/v1/auth/:id",[authMw.verifyToken, authMw.isAdmin], authController.deleteAuser)



}