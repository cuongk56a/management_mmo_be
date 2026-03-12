import express from 'express';
import { auth } from '../../../middlewares/auth';
import { addUpdatedByIdToBody } from '../../../middlewares/addUserToBody';
import { validate } from '../../../middlewares/validate';
import { historyController } from './history.controller';
import { historyValidation } from './history.validation';

const router = express.Router();

/**
 * GET  /history            — Lấy danh sách (có phân trang)
 * GET  /history/all        — Lấy tất cả (không phân trang)
 * GET  /history/count      — Số thông báo CHƯA ĐỌC của user
 * PATCH /history/read-all  — Đánh dấu TẤT CẢ là đã đọc
 * GET  /history/:id        — Lấy 1 thông báo
 * PATCH /history/:id       — Đánh dấu 1 thông báo là đã đọc
 */

router
  .route('/')
  .get(validate(historyValidation.getList), historyController.getList);

router
  .route('/all')
  .get(validate(historyValidation.getAll), historyController.getAll);

router
  .route('/count')
  .get(validate(historyValidation.getCountUnread), historyController.getCountUnread);

router
  .route('/read-all')
  .patch(auth(), addUpdatedByIdToBody, validate(historyValidation.markAllAsRead), historyController.markAllAsRead);

router
  .route('/:historyId')
  .get(validate(historyValidation.getOne), historyController.getOne)
  .patch(auth(), addUpdatedByIdToBody, validate(historyValidation.markAsRead), historyController.markAsRead);

export const historyRoute = router;
