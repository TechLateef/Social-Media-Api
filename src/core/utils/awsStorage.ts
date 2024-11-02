import { S3Client } from "@aws-sdk/client-s3";
import  * as multer from "multer";
import * as multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import { Request } from "express";


// Create S3 instance using S3Client
const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  },
  region: process.env.AWS_REGION || '',
});

/**
 * Create multer S3 storage configuration
 *
 * @param {string} modelName - Name of the image model on cloud
 * @returns {StorageEngine}
 */
export const cloudMulterStorage = (modelName: string): multer.StorageEngine  =>
  multerS3({
    acl: "public-read",
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: process.env.AWS_S3_BUCKET_NAME || '',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${modelName}/${file.originalname.replace(/ /g, "-")}-${Date.now()}${ext}`);
    },
  });

/**
 * Create local disk storage configuration
 *
 * @param {string} model - Local storage model
 * @returns {StorageEngine}
 */
export const multerStorageDev = (model: string): multer.StorageEngine =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "public", model));
    },
    filename: (req, file, cb) => {
      const { originalname } = file;
      cb(null, `${uuidv4()}-${originalname}`);
    },
  });



  export const imageFilter = (req: Request, file: Express.Multer.File, cb:multer.FileFilterCallback ) => {
    if (file.mimetype.startsWith('image')) cb(null, true);
    else cb(null, false);
  }
  
  export const pdfFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(null, false);
  }