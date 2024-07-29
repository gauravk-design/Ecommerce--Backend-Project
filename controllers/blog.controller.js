const blog_model = require("../models/blog.model")

const user_model = require("../models/user.model")

const validateMongoDbId = require("../validationmongo/validatemongodb")

const cloudinaryUploadImg = require("../validationmongo/cloudinary")


//logic to create a new blog

const createBlog = async (req, res)=>{
    try{
        const newBlog = await blog_model.create(req.body)

        res.json(newBlog);

    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Error while creating the blog"
        })
    }
}


const updateBlog = async (req, res)=>{
    const { id } = req.params;
    try{

        const updatedBlog = await blog_model.findByIdAndUpdate(id, req.body,
        {
            new : true,
        });

        res.json(updatedBlog)

    }catch(err){
        console.log(err);
        res.status(500).send({
            message : "Blog is not Found"
        })
    }
}


const getBlog = async (req, res)=>{
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getABlog = await blog_model.findById(id).populate("likes").populate("disLikes");
        const updateViews = await blog_model.findByIdAndUpdate(
            id,
            {
                $inc : {numViews : 1},
            },
            {
                new : true
            }

        )

        res.json(getABlog)
    }catch(err){
        console.log("Error While retriving the blog",err);
        res.status(500).send({
            message: "Internal Server Error"
        })
        
    }
}
       //Get All Blogs

const getAllBlogs = async (req, res)=>{
    try {
        const get = await blog_model.find();
        res.json(get)
    }catch(err){

        console.log("Error While Retriving the blogs", err);
        res.status(500).send({
            message: "Internal server Error"
        })
        
    }
}
/**
 * Logic to delete the blog
 */

const deleteBlog = async (req, res)=>{
    const { id } = req.params;
    try{

        const deletedBlog = await blog_model.findByIdAndDelete(id);

        res.json(deletedBlog)

    }catch(err){
        console.log("Erroe While Deleting the Blog",err);
        res.status(500).send({
            message : "Internal server Error"
        })
    }
}


/**
 * Logic to Like the blog
 */


const likeBlog = async(req, res)=>{
    const { blogId } = req.body
    validateMongoDbId(blogId)

    //Find the blog Which want to be like

    const blog = await blog_model.findById(blogId)

    //find LoginUserId

    const loginUserId = req?.user?._id;

    //Find if the user is allready likes the blog

    const isLiked = blog?.isLiked;

    //find if the user has allready Dislike the blog

    const allreadyDisliked = blog?.disLikes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    if(allreadyDisliked){
        const blog = await blog_model.findByIdAndUpdate(blogId,
            {
                $pull : {disLikes : loginUserId},
                isDisLiked : false,
            },
            {new : true}
        );
        res.json(blog)
    }


    if(isLiked){
        const blog = await blog_model.findByIdAndUpdate(blogId,
            {
                $pull : {likes : loginUserId},
                isLiked : false,
            },
            {new : true}
        );
        res.json(blog)
    } else {
        const blog = await blog_model.findByIdAndUpdate(blogId,
            {
                $push : {likes : loginUserId},
                isLiked : true,
            },
            {new : true}
        );
        res.json(blog)

    }

}

/**
 * logic to disliked the blog
 */


const disLikeTheBlog = async(req, res)=>{
    const { blogId } = req.body
    validateMongoDbId(blogId)

    //Find the blog Which want to be like

    const blog = await blog_model.findById(blogId)

    //find LoginUserId

    const loginUserId = req?.user?._id;

    //Find if the user is allready dislikes the blog

    const isDisLiked = blog?.isDisLiked;

    //find if the user has allready like the blog

    const allreadyLiked = blog?.likes?.find(
        (userId) => userId?.toString() === loginUserId?.toString()
    );

    if(allreadyLiked){
        const blog = await blog_model.findByIdAndUpdate(blogId,
            {
                $pull : {likes : loginUserId},
                isLiked : false,
            },
            {new : true}
        );
        res.json(blog)
    }


    if(isDisLiked){
        const blog = await blog_model.findByIdAndUpdate(blogId,
            {
                $pull : {disLikes : loginUserId},
                isDisLiked : false,
            },
            {new : true}
        );
        res.json(blog)
    } else {
        const blog = await blog_model.findByIdAndUpdate(blogId,
            {
                $push : {disLikes : loginUserId},
                isDisLiked : true,
            },
            {new : true}
        );
        res.json(blog)

    }

}


const uploadImages = async (req, res)=>{
    const { id } = req.params;
    validateMongoDbId(id)

    try {

        const uploader = (path)=> cloudinaryUploadImg(path, "images")
        const urls = [];
        const files = req.files;

        for(const file of files){
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath)
        }

        const findBlog = await blog_model.findByIdAndUpdate(id, {
            images : urls.map((file)=>{
                return file;
            })
        }, { new : true})

        res.json(findBlog)

        
    } catch (err) {

        console.log(err);
        return res.status(500).send({
            message : "Internal Server Error"
        })
        
    }


}

module.exports = {
    createBlog, 
    updateBlog, 
    getBlog, 
    getAllBlogs, 
    deleteBlog, 
    likeBlog, 
    disLikeTheBlog,
    uploadImages
};