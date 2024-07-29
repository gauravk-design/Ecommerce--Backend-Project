const authmw = require("../middleware/auth.mw");

const blogCat_controller = require("../controllers/blogCategory.controller")


module.exports = (app)=> {
    app.post("/ecomm/api/v1/auth/Blogcategory", [authmw.verifyToken, authmw.isAdmin], blogCat_controller.createNewBlogCat)
    app.put("/ecomm/api/v1/auth/Blogcategory/:id", [authmw.verifyToken, authmw.isAdmin], blogCat_controller.updatBlogeCategory)
    app.delete("/ecomm/api/v1/auth/Blogcategory/:id", [authmw.verifyToken, authmw.isAdmin], blogCat_controller.deleteBlogCategory)
    app.get("/ecomm/api/v1/auth/Blogcategory/getall", [authmw.verifyToken], blogCat_controller.getAllBlogCategory)
    app.get("/ecomm/api/v1/auth/Blogcategory/:id", [authmw.verifyToken], blogCat_controller.getBlogCategory)
}