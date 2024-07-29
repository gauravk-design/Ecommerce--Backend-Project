const authMw = require("../middleware/auth.mw")

const brand_controller = require("../controllers/brand.controller")


module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/brand", [authMw.verifyToken, authMw.isAdmin], brand_controller.createNewBrand),
    app.put("/ecomm/api/v1/auth/brand/:id", [authMw.verifyToken, authMw.isAdmin], brand_controller.updateBrand),
    app.delete("/ecomm/api/v1/auth/brand/:id", [authMw.verifyToken, authMw.isAdmin], brand_controller.deleteBrand),
    app.get("/ecomm/api/v1/auth/brand/getall", [authMw.verifyToken], brand_controller.getAllBrands),
    app.get("/ecomm/api/v1/auth/brand/:id", [authMw.verifyToken], brand_controller.getBrand)
}