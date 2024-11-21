import { v2 as cloudinary} from "cloudinary";
import fs from "fs";


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});
 
// const uploadOnCloudinary = async(localFilePath)=>{
//     try{
//         if(!localFilePath) return null;
//         else{
//             const response = await cloudinary.uploader.upload(localFilePath);
//             // console.log("File has been uploaded on cloudinary : ",response.url);
//             fs.unlinkSync(localFilePath);
//             return response;
//         }

//     }catch(error){
//         console.log(error)
//         fs.unlinkSync(localFilePath);//remove the locally saved temporary file.
//         return null;
//     }
// }
const uploadFileOnCloudinary = async (localFilePath, fileType) => {
    try {
        if (!localFilePath) return null;

        

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto", // Use "raw" for PDFs, "image" for images
        });

        fs.unlinkSync(localFilePath); // Remove the local temp file after upload
        return response.secure_url; // Return the file URL for access
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        fs.unlinkSync(localFilePath); // Remove the temp file in case of error
        return null;
    }
};


export {uploadFileOnCloudinary} ;