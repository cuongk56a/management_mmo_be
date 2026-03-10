import mongoose from 'mongoose';
import {IAttachmentDoc} from './attachment.type';
import { IDocModel } from '../../utils/types/entityTypes';
import {TABLE_ATTACHMENT} from './attachment.configs';
import {paginate, toJSON} from '../../utils/plugins'
import { TABLE_USER } from '../user/user.configs';


export interface IAttachmentModelDoc extends IAttachmentDoc {}
interface IAttachmentModel extends IDocModel<IAttachmentModelDoc> {}

const attachmentSchema = new mongoose.Schema<IAttachmentModelDoc>(
  {
    originalName: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    size: {
      type: Number,
    },
    mimetype: {
      type: String,
      required: true
    },
    fileExtension: {
      type: String,
      required: true
    },
    fileType: {
      type: String,
      default: "image",
      required: true
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
      required: false,
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

attachmentSchema.plugin(toJSON);
attachmentSchema.plugin(paginate);

attachmentSchema.index({title: 'text'});
attachmentSchema.index({content: 'text'});

/**
 * @typedef Attachment
 */
export const AttachmentModel = mongoose.model<IAttachmentModelDoc, IAttachmentModel>(TABLE_ATTACHMENT, attachmentSchema);
