import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: "dlhpk5wzd",
  api_key: 452461112932288,
  api_secret: "ZivcNesQ6RiJJPW2rFFLVRU6jwI", // Click 'View API Keys' above to copy your API secret
});

// Optimize delivery by resizing and applying auto-format and auto-quality
// const optimizeUrl = cloudinary.url("shoes", {
//   fetch_format: "auto",
//   quality: "auto",
// });

// console.log(optimizeUrl);

// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    if (uploadResult) fs.unlinkSync(localFilePath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.log("Error while uploading the file on cludinary .. : ", error);
    return null;
  }
};

export { uploadOnCloudinary };
