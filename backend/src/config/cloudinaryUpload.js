import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadFromBuffer = (fileBuffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "listings" },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};