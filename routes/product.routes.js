/**
 * POST  localhost:8080/ecomm/api/v1/auth/products
 */
const authMw = require("../middleware/auth.mw")
const product_controller = require("../controllers/product.controller")

const { productImgResize } = require("../middleware/uploadImages")


const upload_mw = require("../middleware/uploadImages")

module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/products/",[authMw.verifyToken, authMw.isAdmin], product_controller.createNewProduct),
    app.get("/ecomm/api/v1/product/:id",product_controller.getAProduct),
    app.put("/ecomm/api/v1/product/:id",[authMw.verifyToken, authMw.isAdmin], product_controller.updateProduct),
    app.delete("/ecomm/api/v1/auth/product/:id",[authMw.verifyToken, authMw.isAdmin], product_controller.deleteProduct),
    app.get("/ecomm/api/v1/products",product_controller.getAllProduct),
    app.put("/ecomm/api/v1/auth/product/wishlist", [authMw.verifyToken], product_controller.addToWishlist),
    app.put("/ecomm/api/v1/auth/product/rating", [authMw.verifyToken], product_controller.rating)

    app.put("/ecomm/api/v1/auth/product/upload/:id", [authMw.verifyToken, authMw.isAdmin], upload_mw.uploadPhoto.array("images", 10), productImgResize, product_controller.uploadImages)
    
}
