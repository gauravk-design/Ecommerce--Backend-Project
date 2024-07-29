const coupon_controller = require("../controllers/coupon.controller")


const authMw = require("../middleware/auth.mw")


module.exports = (app)=> {
    app.post("/ecomm/api/v1/auth/coupon/", [authMw.verifyToken, authMw.isAdmin], coupon_controller.createCoupon),
    app.get("/ecomm/api/v1/auth/coupon/getall", [authMw.verifyToken, authMw.isAdmin], coupon_controller.getAllCoupon),
    app.put("/ecomm/api/v1/auth/coupon/:id", [authMw.verifyToken, authMw.isAdmin], coupon_controller.updateCoupon),
    app.delete("/ecomm/api/v1/auth/coupon/:id", [authMw.verifyToken, authMw.isAdmin], coupon_controller.deleteCoupon)
}