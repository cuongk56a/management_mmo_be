import {NextFunction, Request, Response} from 'express';
import httpStatus from 'http-status';
import ApiError from '../../utils/core/ApiError';
import {catchAsync} from '../../utils/core/catchAsync';
import {pick} from '../../utils/core/pick';
import {orderService} from './order.service';
import path from 'path';
import xlsx from 'xlsx';
import {attachmentService} from '../attachment/attachment.service';
import moment from 'moment-timezone';
import {appConfigs} from '../../config/config';
import mongoose from 'mongoose';
import { getDataFromExcel } from '../../utils/core/stringUtil';
import { designService } from '../design/design.service';

const createOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await orderService.createOne(req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId} = req.params;
  const {userId, ...body} = req.body;
  try {
    const data = await orderService.updateOne({_id: orderId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const deleteOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId} = req.params;
  try {
    const data = await orderService.updateOne({_id: orderId}, req.body);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.status(httpStatus.NO_CONTENT).send();
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getOne = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId} = req.params;
  const options = pick(req.query, ['hasTarget', 'hasShop', 'hasCreatedBy']);
  try {
    const data = await orderService.getOne({_id: orderId}, options);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getList = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {startAt, endAt, designStatus, searchNameProduct, shopIds, ...filter} = pick(req.query, [
    'targetId',
    'shopIds',
    'orderTiktokId',
    'CODE',
    'buyerUser',
    'receiveUser',
    'phone',
    'status',
    'startAt',
    'endAt',
    'designStatus',
    'searchNameProduct',
  ]);
  const queryOptions = pick(req.query, ['sort', 'limit', 'page']);
  const options = pick(req.query, ['hasTarget', 'hasShop', 'hasCreatedBy']);
  try {
    let objFillter = {};
    if (!!startAt) {
      const startTime = await moment
        .tz(`00:00:00 ${startAt}`, appConfigs.validation.formatDateTime, appConfigs.timeZone)
        .unix();
      objFillter = {
        ...objFillter,
        createdTiktokTimestamp: {$gte: startTime},
      };
    }
    if (!!endAt) {
      const endTime = await moment.tz(`23:59:59 ${endAt}`, appConfigs.validation.formatDateTime, appConfigs.timeZone).unix();
      objFillter = {
        ...objFillter,
        createdTiktokTimestamp: {$lte: endTime},
      };
    }
    if (!!designStatus) {
      objFillter = {
        ...objFillter,
        'products.designStatus': designStatus,
      };
    }
    if (!!searchNameProduct) {
      objFillter = {
        ...objFillter,
        'products.productName': {$regex: searchNameProduct, $options: 'i'},
      };
    }
    if (!!shopIds){
      let idShop = shopIds.split(',')
      objFillter = {
        ...objFillter,
        shopId: {$in: idShop},
      };
    }
    const data = await orderService.getList({...objFillter, ...filter}, {...queryOptions, options});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getAll = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {startAt, endAt, shopIds, ...filter} = pick(req.query, [
    'targetId',
    'shopIds',
    'orderTiktokId',
    'CODE',
    'buyerUser',
    'receiveUser',
    'phone',
    'status',
    'startAt',
    'endAt',
  ]);
  const options = pick(req.query, ['hasTarget', 'hasShop', 'hasCreatedBy']);
  try {
    let objFillter = {};
    if (!!startAt) {
      const startTime = await moment
        .tz(`00:00:00 ${startAt}`, appConfigs.validation.formatDateTime, appConfigs.timeZone)
        .unix();
      objFillter = {
        ...objFillter,
        createdTiktokTimestamp: {$gte: startTime},
      };
    }
    if (!!endAt) {
      const endTime = await moment.tz(`23:59:59 ${endAt}`, appConfigs.validation.formatDateTime, appConfigs.timeZone).unix();
      objFillter = {
        ...objFillter,
        createdTiktokTimestamp: {$lte: endTime},
      };
    }
    if (!!shopIds){
      let idShop = shopIds.split(',')
      objFillter = {
        ...objFillter,
        shopId: {$in: idShop},
      };
    }
    const data = await orderService.getAll({...objFillter, ...filter}, options);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const updateItem = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {orderId, itemId} = req.params;
  const {designFrontUrl, designBackUrl, mockupFrontUrl, mockupBackUrl, note, designStatus, updatedById} = req.body;
  try {
    const data = await orderService.updateOne(
      {_id: orderId, 'products._id': itemId},
      {
        $set: {
          'products.$.designFrontUrl': designFrontUrl,
          'products.$.designBackUrl': designBackUrl,
          'products.$.designStatus': designStatus,
          'products.$.mockupFrontUrl': mockupFrontUrl,
          'products.$.mockupBackUrl': mockupBackUrl,
          'products.$.note': note,
        },
        updatedById,
      },
    );
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
    }
    const productName = data.products.find(product => String(product?._id) ==  itemId)?.productName;
    await designService.updateOne({productName: productName, targetId: data.targetId},{mockupFrontUrl,mockupBackUrl});
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const importExcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {fileName, organizationId, createdById, shopId} = req.body;
  try {
    const excel = await attachmentService.getOne({fileName});
    const filePath = path.join(__dirname, '..', '..', '..', excel?.path || fileName);
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData: any[][] = xlsx.utils.sheet_to_json(worksheet, {raw: false});

    // res.send(jsonData)
    let orderMap: any = {};

    jsonData.forEach((item: any) => {
      const orderId = String(item['Order ID']).replace(/\t/g, '').trim();

      if (orderMap[orderId]) {
        orderMap[orderId].products.push({
          productName: item['Product Name'],
          variationName: item['Variation'],
          productCategories: item['Product Category'],
          quantity: item['Quantity'],
          note: item['Buyer Message'],
        });
      } else {
        // Nếu chưa tồn tại, tạo đơn hàng mới
        orderMap[orderId] = {
          targetId: organizationId,
          orderTiktokId: orderId,
          shopId: shopId,
          createTimeOrderTT: item['Created Time'].replace(/\t/g, '').trim(),
          buyerUser: item['Buyer Username'],
          receiveUser: item['Recipient'],
          phone: String(item['Phone #']),
          addressLine: item['Address Line 1'],
          country: item['United States'],
          state: item['State'],
          city: item['City'],
          zipCode: item['Zipcode'].replace(/\t/g, '').trim(),
          paymentMethod: item['Payment Method'],
          sellerNote: '',
          shippingFee: item['Shipping Fee After Discount'],
          amount: item['Order Amount'],
          products: [
            {
              productName: item['Product Name'],
              variationName: item['Variation'],
              productCategories: item['Product Category'],
              quantity: item['Quantity'],
              note: item['Buyer Message'],
            },
          ],
        };
      }
    });

    // Chuyển đối tượng orderMap thành mảng để gửi đi
    const data = Object.values(orderMap);
    const result = await Promise.all(
      data.map((item: any) => {
        const {orderTiktokId, ...other} = item;
        return orderService.updateOne(
          {
            targetId: organizationId,
            orderTiktokId: orderTiktokId,
            shopId: shopId,
          },
          {
            ...other,
            createdById,
          },
          {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
          },
        );
      }),
    );
    res.send(result);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const exportExcel = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const {fileName, orderIds} = pick(req.query,['fileName', 'orderIds']);
  try {
    const excel = await attachmentService.getOne({fileName});
    const filePath = path.join(__dirname, '..', '..', '..', excel?.path || fileName);
    const workbook = xlsx.readFile(filePath);

    const sheetName = workbook.SheetNames[1];
    const worksheet = workbook.Sheets[sheetName];

    let jsonData:any[][] = xlsx.utils.sheet_to_json(worksheet, {header: 1});
    
    const orders = orderIds.split(',');
    await Promise.all(
      orders.map(async(orderId: mongoose.Schema.Types.ObjectId) => {
        const order = await orderService.getOne({_id: orderId})
        if(order){
          jsonData.push([
            order?.orderTiktokId,
            '',
            '',
            order?.trackingIdFLS,
            'UPS',
            'UPS Ground',
            ''
          ])
        }
        
      })
    )
    const newWorksheet = xlsx.utils.aoa_to_sheet(jsonData);
    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, filePath);

    const downloadUrl = getDataFromExcel(fileName);
    res.json(downloadUrl);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

const getSummary = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const filter = pick(req.query, ['startAt', 'shopId', 'targetId']);
  try {
    const data = await orderService.getSummary(filter);
    res.send(data);
  } catch (error: any) {
    return next(new ApiError(httpStatus.NOT_FOUND, error.message));
  }
});

export const orderController = {
  createOne,
  updateOne,
  deleteOne,
  getOne,
  getAll,
  getList,
  updateItem,
  importExcel,
  exportExcel,
  getSummary,
};
