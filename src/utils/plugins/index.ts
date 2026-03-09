import paginateM from 'mongoose-paginate-v2'
import aggregatePaginateM from "mongoose-aggregate-paginate-v2"
import mongoose from 'mongoose';
const deepPopulateM = require('mongoose-deep-populate')(mongoose);
const privates = require('mongoose-private');

export const paginate = paginateM;
export * from './toJSON.plugin';
export const aggregatePaginate = aggregatePaginateM;
export const deepPopulate = deepPopulateM;
export const privatePlugin = privates;