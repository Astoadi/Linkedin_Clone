import { Router } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config({path:'../.env'});
import { register,login,uploadProfilePicture,updateUserProfile, getUserAndProfile, updateProfileData, getAllUsers, downloadProfile, sendConnectionRequest, getMyConnectionRequest, whatAreMyConnections, acceptConnectionRequest, getUserProfileBasedOnUsername } from "../controllers/user.controller.js";
const router=Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  });
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

const upload = multer({ storage: storage2 }); //new change

router.route('/update_profile_picture').post(upload.single('profile_picture'),uploadProfilePicture);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user_update').post(updateUserProfile);
router.route("/get_user_and_proflie").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUsers);
router.route("/user/download_resume").get(downloadProfile);
router.route("/user/send_connection_request").post(sendConnectionRequest);
router.route("/user/getConnectionRequests").get(getMyConnectionRequest);
router.route("/user/user_connection_request").get(whatAreMyConnections);
router.route("/user/accept_connection_request").post(acceptConnectionRequest);
router.route('/user/get_User_Profile_Based_On_Username').get(getUserProfileBasedOnUsername);

export default router;