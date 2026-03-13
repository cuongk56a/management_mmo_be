import { appConfigs } from "../../config/config";

export const TABLE_ATTACHMENT = `${appConfigs.database.tablePrefix}_attachment`;

import multer from 'multer';
import path from 'path';

/**
 * Tạo tên file theo pattern: {fileType}-{YYYYMMDD-HHmmss}-{slug}.{ext}
 * Ví dụ: image-20260313-094512-ten-file-cua-toi.jpg
 */
function generateFileName(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname).toLowerCase(); // .jpg, .xlsx
  const nameWithoutExt = path.basename(file.originalname, ext);
  const fileType = file.mimetype.split('/')[0]; // image | application

  // Slug tên gốc: bỏ dấu, ký tự đặc biệt, thay space bằng -
  const slug = nameWithoutExt
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu unicode
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')   // chỉ giữ chữ, số, space, -
    .replace(/\s+/g, '-')           // space → -
    .replace(/-+/g, '-')            // nhiều - liên tiếp → 1 -
    .replace(/^-|-$/g, '');         // trim -

  // Timestamp ngắn gọn: YYYYMMDD-HHmmss
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

  return `${fileType}-${timestamp}-${slug || 'file'}${ext}`;
}

const storageImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  }
});

const uploadImage = multer({
  storage: storageImage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
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
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file));
  }
});

const uploadExcel = multer({
  storage: storageExcel,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = /xlsx|xlm|xls|csv/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only .xlsx, .xlm, .xls and .csv format allowed!'));
    }
  }
});

export const upload = {
  uploadImage,
  uploadExcel,
};