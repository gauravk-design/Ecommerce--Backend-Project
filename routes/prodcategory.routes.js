/**
 * POST - localhost:8080/ecomm/api/v1/auth/categories
 */

const authMw = require("../middleware/auth.mw")

category_controller = require("../controllers/prodcategory.controller")




module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/category", [authMw.verifyToken, authMw.isAdmin], category_controller.createNewCategory),
    app.put("/ecomm/api/v1/auth/category/:id", [authMw.verifyToken, authMw.isAdmin], category_controller.updateCategory),
    app.delete("/ecomm/api/v1/auth/category/:id", [authMw.verifyToken, authMw.isAdmin], category_controller.deleteCategory),
    app.get("/ecomm/api/v1/auth/category/getall", category_controller.getAllCategory)
    app.get("/ecomm/api/v1/auth/category/:id", category_controller.getCategory)
    
    
}