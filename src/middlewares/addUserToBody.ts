import {Request, Response} from 'express';

export function addCreatedByIdToBody(req: Request, res: Response, next: any) {
  // console.log("req.userId", req.userId)
  // console.log("req.userInfo", req.userInfo)
  req.body.createdById = req.userId;
  // req.body.createdAt = new Date();
  next();
}

export function addUpdatedByIdToBody(req: Request, res: Response, next: any) {
  // console.log("req.userId", req.userId)
  // console.log("req.userInfo", req.userInfo)
  req.body.updatedById = req.userId;
  // req.body.createdAt = new Date();
  next();
}

export function addDeletedByToBody(req: Request, res: Response, next: any) {
  req.body.deletedById = req.userId;
  req.body.deletedAt = new Date();
  return next();
}
