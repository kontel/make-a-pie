import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
export const ourFileRouter = {
  pieImage: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter; 