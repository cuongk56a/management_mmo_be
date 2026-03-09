import * as mongoose from 'mongoose';

export interface IDoc extends mongoose.Document {
  createdById: any;
  createdAt: Date;
  deletedById?: any;
  deletedAt?: Date;
  updatedAt?: Date;
  updatedById?: any;

  tempData: any;
}

export interface IDocModel<T> extends mongoose.Model<T> {
  toJSON: any;
  toObject: any;
  aggregatePaginate: any;
  paginate: any;
}
