import mongoose from 'mongoose';
import {DESIGN_STATUS, IOrderDoc, ORDER_STATUS} from './order.type';
import {IDocModel} from '../../utils/types/entityTypes';
import {TABLE_ORDER} from './order.configs';
import {paginate, toJSON} from '../../utils/plugins';
import {TABLE_USER} from '../user/user.configs';
import {createNewQueue} from '../../redis/queue';
import {TABLE_ORGANIZATION} from '../organization/organization.configs';
import {TABLE_SHOP} from '../shop/shop.configs';
import moment from 'moment-timezone';
import {appConfigs} from '../../config/config';
import { designService } from '../design/design.service';
import { DESIGN_STATUS_TYPE } from '../design/design.type';

export async function generateUniqueCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let CODE = '';

  // Lặp lại quá trình sinh code cho đến khi có một code duy nhất
  while (true) {
    for (let i = 0; i < 9; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      CODE += characters[randomIndex];
    }

    // Kiểm tra xem code đã tồn tại trong cơ sở dữ liệu chưa
    const existingDocument = await OrderModel.findOne({CODE});
    if (!existingDocument) {
      return CODE; // Nếu không tồn tại, trả về code mới
    }

    // Nếu tồn tại, đặt lại code và lặp lại quá trình sinh
    CODE = '';
  }
}

export interface IOrderModelDoc extends IOrderDoc {}
interface IOrderModel extends IDocModel<IOrderModelDoc> {}

const orderSchema = new mongoose.Schema<IOrderModelDoc>(
  {
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'targetOnModel',
      required: true,
    },
    targetOnModel: {
      type: String,
      enum: [TABLE_ORGANIZATION],
      default: TABLE_ORGANIZATION,
    },
    CODE: {
      type: String,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      // required: true,
    },
    orderTiktokId: {
      type: String,
      required: true,
    },
    createTimeOrderTT: {
      type: String,
    },
    buyerUser: {
      type: String,
    },
    receiveUser: {
      type: String,
    },
    phone: {
      type: String,
    },
    addressLine: {
      type: String,
    },
    country: {
      type: String,
    },
    state: {
      type: String,
    },
    city: {
      type: String,
    },
    zipCode: {
      type: Number,
    },
    paymentMethod: {
      type: String,
    },
    sellerNote: {
      type: String,
    },
    shippingFee: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    isDesign: {
      type: Boolean,
    },
    products: {
      type: [
        {
          productName: {
            type: String,
          },
          variationName: {
            type: String,
          },
          productCategories: {
            type: String,
          },
          designFrontUrl: {
            type: String,
          },
          designBackUrl: {
            type: String,
          },
          mockupFrontUrl: {
            type: String,
          },
          mockupBackUrl: {
            type: String,
          },
          quantity: {
            type: Number,
          },
          note: {
            type: String,
          },
          designStatus: {
            type: String,
            enum: DESIGN_STATUS,
            default: DESIGN_STATUS.DESIGN_PENDING,
          },
        },
      ],
    },
    status: {
      type: String,
      enum: ORDER_STATUS,
      default: ORDER_STATUS.PENDING,
    },
    systemNote: {
      type: String,
    },
    flashShipFee: {
      type: Number,
      default: 0,
    },
    trackingIdFLS: {
      type: String,
    },
    createdTiktokTimestamp: {
      type: Number,
    },
    linkLabel: {
      type: String,
    },
    typeShipment: {
      type: String,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: {type: Date, required: false},
  },
  {
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

// async function preSave() {
//   if (!!this.createdAt) {
//     console.log("🚀 ~ preSave ~ this.createdAt:", this.createdAt)
//     this.createdTiktokTimestamp = await moment
//       .tz(this.createdAt, appConfigs.validation.formatDateTime, appConfigs.timeZone)
//       .unix();
//   }
// }

async function preUpdate() {
  const {createdAt} = this.getUpdate()['$setOnInsert'];
  const {products} = this.getUpdate();
  if (this.getUpdate()['$setOnInsert']['__v']==0){
    this.getUpdate().$set.createdTiktokTimestamp = await moment
      .tz(createdAt, appConfigs.validation.formatDateTime, appConfigs.timeZone)
      .unix();

    const updatedProducts = await Promise.all(
      products.map(async(product:any)=>{
        const color = product.variationName.split(',');
        const designProduct = await designService.getOne({
          targetId: this.getUpdate().targetId,
          productName: product.productName,
          color: color[0].toUpperCase(),
          designStatus: DESIGN_STATUS_TYPE.DESIGN_COMPLETED,
        });
        if (designProduct) {
          return {
            ...product,
            designStatus: DESIGN_STATUS.DESIGN_COMPLETED,
            designFrontUrl: designProduct.designFrontUrl || '',
            designBackUrl: designProduct.designBackUrl || '',
            mockupFrontUrl: designProduct.mockupFrontUrl || '',
            mockupBackUrl: designProduct.mockupBackUrl || '',
          };
        }else{
          await designService.createOne({
            targetId: this.getUpdate().targetId,
            productName: product.productName,
            color: color[0].toUpperCase(),
            createdById: this.getUpdate().createdById,
          })
        }
        return product;
      })
    )
    this.getUpdate().products = updatedProducts
  }
}

// orderSchema.pre('save', preSave);
orderSchema.pre('findOneAndUpdate', preUpdate);

orderSchema.virtual('target', {
  ref: TABLE_ORGANIZATION,
  localField: 'targetId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('shop', {
  ref: TABLE_SHOP,
  localField: 'shopId',
  foreignField: '_id',
  justOne: true,
});

orderSchema.virtual('createdBy', {
  ref: TABLE_USER,
  localField: 'createdById',
  foreignField: '_id',
  justOne: true,
});

const populateArr = ({hasTarget, hasShop, hasCreatedBy}: {hasTarget: boolean; hasShop: boolean; hasCreatedBy: boolean}) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasTarget
        ? {
            path: 'target',
          }
        : [],
    )
    .concat(
      !!hasShop
        ? {
            path: 'shop',
          }
        : [],
    )
    .concat(
      !!hasCreatedBy
        ? {
            path: 'createdBy',
          }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr(this.getOptions()));
  next();
}

orderSchema.pre('findOne', preFind);
orderSchema.pre('find', preFind);

async function afterSave(doc: IOrderModelDoc, next: any) {
  try {
    if (!!doc && (doc.status == ORDER_STATUS.CANCELLED || doc.status == ORDER_STATUS.REJECT)) {
      const orderQueue = createNewQueue('OrderQueue');
      orderQueue
        .add({
          Order: doc,
        })
        .catch(err => {
          console.error('Model:Order:afterSave Err ', err);
        })
        .then(() => {
          next();
        });
    }
  } catch (error) {
    next()
  } finally {
    next()
  }
}

orderSchema.post('save', afterSave);
orderSchema.post('findOneAndUpdate', afterSave);

/**
 * @typedef Order
 */
export const OrderModel = mongoose.model<IOrderModelDoc, IOrderModel>(TABLE_ORDER, orderSchema);
