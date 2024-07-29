const createBlog = require("../controllers/blog.controller")
const blogController = require("../controllers/blog.controller")

const authMiddleware = require("../middleware/auth.mw")

const upload_mw = require("../middleware/uploadImages")


module.exports = (app)=>{
    app.post("/ecomm/api/v1/auth/blog", [authMiddleware.verifyToken, authMiddleware.isAdmin], blogController.createBlog)
    app.put("/ecomm/api/v1/auth/blog/likes", [authMiddleware.verifyToken], blogController.likeBlog)
    app.put("/ecomm/api/v1/auth/blog/dislikes", [authMiddleware.verifyToken], blogController.disLikeTheBlog)
    app.put("/ecomm/api/v1/auth/blog/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], blogController.updateBlog)
    app.get("/ecomm/api/v1/auth/blog/getblog/:id",blogController.getBlog)
    app.get("/ecomm/api/v1/auth/blog/getallblog", blogController.getAllBlogs)
    app.delete("/ecomm/api/v1/auth/blog/deleteblog/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], blogController.deleteBlog)
    app.put("/ecomm/api/v1/auth/blog/upload/:id", [authMiddleware.verifyToken, authMiddleware.isAdmin], upload_mw.uploadPhoto.array("images", 10), upload_mw.blogImgResize , blogController.uploadImages)
}