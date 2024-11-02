import { Request, Response, NextFunction } from 'express';
import  multer from 'multer';
import { StatusCodes } from 'http-status-codes';
import { cloudMulterStorage, multerStorageDev, imageFilter, pdfFilter } from './awsStorage';
import catchAsync from './catchAsync';

const multerStorageProd = cloudMulterStorage('profile');
const multerStorageDevInstance = multerStorageDev('img/profile');

const imageUploader = multer({
  storage: process.env.NODE_ENV === 'development' ? multerStorageDevInstance : multerStorageProd,
  fileFilter: imageFilter,
  limits: {
    fileSize: 1024 * 1024 * 12, // Maximum 12mb file
  },
});

const devFunc = (req: Request) => (file: Express.Multer.File) => {
  return `${req.protocol}://${req.get('host')}/img/profile/${file.filename}`;
};

const prodFunc = (file: Express.Multer.File) => ( file as any).location;

export const uploadImagesArray = imageUploader.array('images', 10);
export const uploadImageSingle = imageUploader.single('image');

export const getImagesUrlArray = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) {
    return res.status(StatusCodes.OK).json({ status: 'failed', message: 'No files were passed' });
  }

  const images = (req.files as Express.Multer.File[]).map(
    process.env.NODE_ENV === 'development' ? devFunc(req) : prodFunc
  );

  res.status(StatusCodes.OK).json({ status: 'success', result: images.length, data: images });
});

export const getImageUrlSingle = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(StatusCodes.OK).json({ status: 'failed', message: 'No file was passed' });
  }

  const url = process.env.NODE_ENV === 'development'
    ? devFunc(req)(req.file)
    : prodFunc(req.file);
  // console.log("url",url,req.file)
  res.status(StatusCodes.OK).json({ status: 'success', data: url });
});

const pdfUploader = multer({
  storage: process.env.NODE_ENV === 'development' ? multerStorageDev('/documents') : multerStorageProd,
  fileFilter: pdfFilter,
  limits: {
    fileSize: 1024 * 1024 * 4, // Maximum 4mb file
  },
});

const devPdfFunc = (req: Request) => (file: Express.Multer.File) => {
  return `${req.protocol}://${req.get('host')}/pdf/${file.filename}`;
};

export const pdfUploadSingle = pdfUploader.single("pdfFile");

export const getPdfUrl = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
    return res.status(StatusCodes.OK).json({ status: "failed", message: "No file was passed" });
  }

  const url = process.env.NODE_ENV === "development"
    ? devPdfFunc(req)(req.file)
    : prodFunc(req.file);

  res.status(StatusCodes.OK).json({ status: "success", data: url });
});
