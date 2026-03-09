import { appConfigs } from "../../config/config";

export const TABLE_ATTACHMENT = `${appConfigs.database.tablePrefix}_attachment`;

import multer from 'multer';
import path from 'path';
import { toSlug, toSlug2 } from "../../utils/core/toSlug";

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads/image'); // Thư mục lưu trữ file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${toSlug2(file.originalname)}`);
  }
});

const uploadImage = multer({
  storage: storageImage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn kích thước file là 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg and .png format allowed!'));
    }
  }
});

const storageExcel = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads/excel'); // Thư mục lưu trữ file
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}-${toSlug2(file.originalname)}`);
  }
});

const uploadExcel = multer({
  storage: storageExcel,
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn kích thước file là 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xlm|xls|csv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    // const mimetype = fileTypes.test(file.mimetype);
    
    if (extname) {
      cb(null, true);
    } else {
      console.log(1)
      cb(new Error('Only .xlsx, .xlm, .xls, .xlm and .csv format allowed!'));
    }
  }
});

export const upload = {
  uploadImage,
  uploadExcel,
};