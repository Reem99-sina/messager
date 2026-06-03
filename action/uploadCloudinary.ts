import cloudinary from "@/libs/cloudinary";

export const uploadToCloudinary=async({buffer}:{buffer:Buffer<ArrayBuffer>})=>{
    const uploaded = await new Promise<any>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "chat-images",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    }
  );
  return uploaded
}
