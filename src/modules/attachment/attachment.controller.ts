import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {attachmentService} from './attachment.service';
import {MulterFile} from './attachment.type';
import path from 'path';
import xlsx from 'xlsx'

const createOrUpdateMany = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files || !Array.isArray(req.files)) {
    return res.status(400).json({message: 'No files uploaded'});
  }
  try {
    const images = await Promise.all(
      (req.files as MulterFile[]).map(async image => {
        return await attachmentService.updateOne(
          {
            fileName: image.filename,
          },
          {
            originalName: image.originalname,
            path: image.path,
            size: image.size,
            mimetype: image.mimetype,
            fileExtension: image.mimetype.split('/')[1],
            fileType: image.mimetype.split('/')[0],
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        );
      }),
    );

    res.status(httpStatus.OK).json(images);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {fileName} = pick(req.params, ['fileName']);

  try {
    const data = await attachmentService.getOne({fileName: fileName});
    if(!data){
      res.send(fileName);
    }else {
      const filePath = path.join(__dirname, '..', '..', '..', data?.path);
      res.sendFile(filePath);
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const createExcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.file || typeof req.file !== 'object') {
    return res.status(400).json({message: 'No files uploaded'});
  }
  try {
    const data = await attachmentService.createOne(
      {
        originalName: req.file.originalname,
        fileName: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        fileExtension: req.file.mimetype.split('/')[1],
        fileType: req.file.mimetype.split('/')[0],
      },
    );
    res.status(httpStatus.OK).json(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOneExcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {fileName} = pick(req.params, ['fileName']);

  try {
    const data = await attachmentService.getOne({fileName});
    if(!data){
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }else {
      const filePath = path.join(__dirname, '..', '..', '..', data?.path);
      res.sendFile(filePath);
    }
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['fileName']);
  const sortOptions = pick(req.query, ['sort']);
  try {
    const data = await attachmentService.getAll(filter, undefined, {...sortOptions});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const attachmentController = {
  createOrUpdateMany,
  getOne,
  createExcel,
  getOneExcel,
  getAll,
};
