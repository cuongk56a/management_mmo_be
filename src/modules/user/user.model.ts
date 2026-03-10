import mongoose from 'mongoose';
import { IUserDoc, UserGender } from './user.type';
import { IDocModel } from '../../utils/types/entityTypes';
import { TABLE_USER } from './user.configs';
import { paginate, toJSON } from '../../utils/plugins';
import { getImageUriFromFilename } from '../../utils/core/stringUtil';

export interface IUserModelDoc extends IUserDoc { }
interface IUserModel extends IDocModel<IUserModelDoc> { }

const userSchema = new mongoose.Schema<IUserModelDoc>(
  {
    phone: {
      type: String,
      required: false,
      index: { unique: true, sparse: true },
    },
    email: {
      type: String,
      required: true,
      index: { unique: true, sparse: true },
    },
    fullName: {
      type: String,
    },
    hashedPassword: {
      type: String,
      required: false,
      private: true,
    },
    avatar: {
      type: String,
      required: false,
    },
    birthday: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: UserGender,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    updatedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: TABLE_USER,
    },
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual('avatarUri').get(function () {
  return getImageUriFromFilename(this.avatar || '');
});

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const populateArr = ({ hasAddress, hasRole }: { hasAddress: boolean, hasRole: boolean }) => {
  let pA: any[] = [];
  return pA
    .concat(
      !!hasAddress
        ? {
          path: 'address',
          options: { hasLocation: true }
        }
        : [],
    )
    .concat(
      !!hasRole
        ? {
          path: 'role',
        }
        : [],
    );
};

function preFind(next: any) {
  this.populate(populateArr({ ...this.getOptions(), ...this._conditions }));
  next();
}

userSchema.pre('findOne', preFind);
userSchema.pre('find', preFind);

// userSchema.index({ phone: 1 });
// userSchema.index({ email: 1 });
userSchema.index({ fullName: 'text' });

/**
 * @typedef User
 */
export const UserModel = mongoose.model<IUserModelDoc, IUserModel>(TABLE_USER, userSchema);
