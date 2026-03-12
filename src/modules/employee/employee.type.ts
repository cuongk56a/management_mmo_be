import mongoose from 'mongoose';
import { IDoc } from '../../utils/types/entityTypes';

export enum ROLETYPE {
    MANAGER = 'MANAGER',
    STAFF = 'STAFF'
}

export interface IEmployeeDoc extends IDoc {
    userId: mongoose.Types.ObjectId;
    CODE: string;
    role: ROLETYPE;
    commissionRate: number;
    isActive: boolean;
}