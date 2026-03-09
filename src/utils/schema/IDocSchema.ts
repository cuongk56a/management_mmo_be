import {IDocSchemaOptions} from '../types/shemaTypes';
import mongoose, {Document, HydratedDocument, Query} from 'mongoose';
import {paginate, toJSON} from '../plugins';

export class IDocSchema<T> extends mongoose.Schema<T> {
  suggetionList: {
    dataType: any; //SUGGESTION_TYPES;
    dataKey: (value: any) => string;
    valueKey: string;
  }[] = [];

  preSave(doc: HydratedDocument<any, any, any>, next: any) {
    next();
  }

  preFindOneAndUpdate(query: Query<T, T, any, any>, next: any) {
    next();
  }
  preFind(query: Query<T, T, any, any>, next: any) {
    next();
  }

  postSave(schema: Document<any, any, any>, next: any) {
    next();
  }
  postFindOneAndUpdate(schema: Document<any, any, any>, next: any) {
    next();
  }

  constructor(a: any, b: any, options: IDocSchemaOptions) {
    super(
      {
        ...a,
        ...(options.hasEditor && options.tableUser
          ? {
              createdById: {
                type: mongoose.Schema.Types.ObjectId,
                ref: options.tableUser,
                required: true,
              },
              updatedById: {
                type: mongoose.Schema.Types.ObjectId,
                ref: options.tableUser,
                required: false,
              },
              deletedById: {
                type: mongoose.Schema.Types.ObjectId,
                ref: options.tableUser,
                required: false,
              },
              deletedAt: {type: Date, required: false},
            }
          : {}),
      },
      {
        ...b,
        toJSON: {virtuals: true},
        toObject: {virtuals: true},
        timestamps: true,
      },
    );

    // const addCreateSuggetion = (data: any, cb: any) => {
    //   console.log('addCreateSuggetion', data, this.suggetionList);
    //   const queue = createNewQueue(QUEUE_SUGGESTION_CREATE);
    //   queue
    //     .add(
    //       this.suggetionList.map(ss => {
    //         const value = data[ss.valueKey];
    //         console.log('addCreateSuggetion 2', {
    //           dataType: ss.dataType,
    //           dataKey: ss.dataKey(value),
    //           value: value,
    //         });
    //         return {
    //           dataType: ss.dataType,
    //           dataKey: ss.dataKey(value),
    //           value: value,
    //         };
    //       }),
    //     )
    //     .then(() => {
    //       cb();
    //     })
    //     .catch(() => {
    //       // TODO add Log
    //       cb();
    //     });
    // };
    const thisClass = this;

    this.pre('save', function (next: any) {
      console.log('IDocSchema:pre:Save');
      thisClass.preSave(this, next);
    });
    this.pre('findOneAndUpdate', function (next: any) {
      console.log('IDocSchema:pre:findOneAndUpdate');
      const update = this.getUpdate();
      thisClass.preFindOneAndUpdate(this, next);
      // addCreateSuggetion(update, () => thisClass.preFindOneAndUpdate(this, next));
    });

    this.pre('findOne', function (next: any) {
      console.log('IDocSchema:pre:findOne');
      thisClass.preFind(this, next);
    });
    this.pre('find', function (next: any) {
      console.log('IDocSchema:pre:find');
      thisClass.preFind(this, next);
    });

    this.post('save', function (doc: any, next: any) {
      console.log('IDocSchema:post:Save');
      if (!!doc) {
        // addCreateSuggetion(doc.toJSON(), () => thisClass.postSave(this, next));

        thisClass.postSave(this, next);
      } else {
        next(new Error('Entity.NotFound'));
      }
    });
    this.post('findOneAndUpdate', function (doc: any, next: any) {
      console.log('IDocSchema:post:findOneAndUpdate');
      if (!!doc) {
        // addCreateSuggetion(doc.toJSON(), () => thisClass.postFindOneAndUpdate(doc, next));
        thisClass.postFindOneAndUpdate(doc, next);
      } else {
        next(new Error('Entity.NotFound'));
      }
    });

    !options.skipPlugin?.toJSON && this.plugin(toJSON);
    !options.skipPlugin?.paginate && this.plugin(paginate);
  }
}
