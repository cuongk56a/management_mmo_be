import { Response } from 'express';
import httpStatus from 'http-status';

export type ResponseStatus = 'Success' | 'Error';

export type ApiResponse<TData = unknown, TMeta = unknown> = {
  code: number;
  status: ResponseStatus;
  message?: string;
  data?: TData;
  meta?: TMeta;
} & Record<string, unknown>;

type SendResponseParams<TData = unknown, TMeta = unknown> = {
  code?: number;
  status?: ResponseStatus;
  message?: string;
  data?: TData;
  meta?: TMeta;
  extra?: Record<string, unknown>;
};

function inferStatus(code: number): ResponseStatus {
  return code >= 400 ? 'Error' : 'Success';
}

function defaultMessage(code: number): string {
  return (httpStatus as any)[code] || 'OK';
}

export function sendResponse<TData = unknown, TMeta = unknown>(
  res: Response,
  { code = httpStatus.OK, status, message, data, meta, extra }: SendResponseParams<TData, TMeta> = {},
) {
  const resolvedMessage = message ?? defaultMessage(code);
  const payload: ApiResponse<TData, TMeta> = {
    code,
    status: status ?? inferStatus(code),
    ...(resolvedMessage ? { message: resolvedMessage } : {}),
    ...(data !== undefined ? { data } : {}),
    ...(meta !== undefined ? { meta } : {}),
    ...(extra ?? {}),
  };

  return res.status(code).send(payload);
}

export function sendOk<TData = unknown>(res: Response, data?: TData, message = 'OK') {
  return sendResponse<TData>(res, { code: httpStatus.OK, message, data });
}

export function sendCreated<TData = unknown>(res: Response, data?: TData, message = 'Created') {
  return sendResponse<TData>(res, { code: httpStatus.CREATED, message, data });
}

export function sendNoContent(res: Response) {
  return res.status(httpStatus.NO_CONTENT).send();
}

export function sendError(
  res: Response,
  code: number = httpStatus.BAD_REQUEST,
  message?: string,
  extra?: Record<string, unknown>,
) {
  return sendResponse(res, { code, status: 'Error', message: message ?? defaultMessage(code), extra });
}

