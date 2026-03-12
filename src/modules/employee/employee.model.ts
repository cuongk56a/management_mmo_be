import mongoose from 'mongoose';
import { IEmployeeDoc, ROLETYPE } from './employee.type';
import { IDocModel } from '../../utils/types/entityTypes';
import { TABLE_EMPLOYEE } from './employee.configs';
import { paginate, toJSON } from '../../utils/plugins';
import { TABLE_USER } from '../user/user.configs';

export interface IEmployeeModelDoc extends IEmployeeDoc { }
interface IEmployeeModel extends IDocModel<IEmployeeModelDoc> { }

const employeeSchema = new mongoose.Schema<IEmployeeModelDoc>(
  {
    CODE: {
      type: String,
      required: true,
      unique: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: true,
    },
    role: {
      type: String,
      enum: ROLETYPE,
      required: true,
    },
    commissionRate: {
      type: Number,
      required: true,
      default: 0,
      max: 100,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_EMPLOYEE,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_EMPLOYEE,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_EMPLOYEE,
    },
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

employeeSchema.virtual('user', {
  ref: TABLE_USER,
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

employeeSchema.plugin(toJSON);
employeeSchema.plugin(paginate);

const populateArr = ({ hasUser }: { hasUser: boolean }) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasUser
        ? {
          path: 'user'
        }
        : [],
    )
};

function preFind(next: any) {
  this.populate(populateArr({ ...this.getOptions(), ...this._conditions }));
  next();
}

employeeSchema.pre('findOne', preFind);
employeeSchema.pre('find', preFind);

employeeSchema.index({ userId: 1 });
employeeSchema.index({ role: 1 });
employeeSchema.index({ commissionRate: 1 });
employeeSchema.index({ isActive: 1 });

/**
 * @typedef Employee
 */
export const EmployeeModel = mongoose.model<IEmployeeModelDoc, IEmployeeModel>(TABLE_EMPLOYEE, employeeSchema);