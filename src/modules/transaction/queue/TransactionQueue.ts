import AbstractQueueProcessor from '../../../redis/queue';
import { organizationService } from '../../organization/organization.service';
import {ITransactionModelDoc} from '../transaction.model';
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from '../transaction.type';
export class TransactionQueue extends AbstractQueueProcessor {
  processQueue = async (
    job: {
      data: {
        trans: ITransactionModelDoc;
        isNew: boolean;
      };
    },
    done: any,
  ) => {
    const {trans} = job.data;
    
    new Promise(async (resolve: any) => {
      if(trans.transType == TRANSACTION_TYPE.ADDTION_MONEY){
        await organizationService.updateOne({
          _id: trans.targetId
        },{
          $inc: {money: trans.value},
        })
      }
      if(trans.transType == TRANSACTION_TYPE.DEDUCTION_ORDER){
        await organizationService.updateOne({
          _id: trans.targetId
        },{
          $inc: {money: -trans.value},
        })
      }
      if(trans.transType == TRANSACTION_TYPE.REJECT_ORDER){
        await organizationService.updateOne({
          _id: trans.targetId
        },{
          $inc: {money: +trans.value},
        })
      }
      resolve();
    }).finally(() => {
      console.log('DONE TRANSACTION!');
      done();
    });
  };
}
