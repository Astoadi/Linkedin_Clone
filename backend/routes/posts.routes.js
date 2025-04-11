import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { activeCheck, commentPost, createPost, deletePost, delete_comment_of_user, getAllPosts, get_comments_by_post, increment_likes } from "../controllers/posts.controller.js";
import multer from 'multer';
import dotenv from "dotenv";
dotenv.config({path:'../.env'});

const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})
const storage2 = new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
    folder:'uploads',
    allowedFormat: ['png','jpg','jpeg']
  }
})
  const upload = multer({ storage: storage2 });

router.route('/').get(activeCheck);

router.route("/post").post(upload.single('media'),createPost);
router.route("/posts").get(getAllPosts);
router.route("/delete_post").delete(deletePost);
router.route("/comment").post(commentPost);
router.route("/get_comments").get(get_comments_by_post);
router.route("/delete_comment").delete(delete_comment_of_user);
router.route("/increment_post_like").post(increment_likes);
//router.route('/decrement_post_like').post(decrement_likes);

export default router;