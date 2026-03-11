import { AsyncLocalStorage } from 'async_hooks';

// Lưu trữ thông tin domain/IP của request hiện tại
export const requestContext = new AsyncLocalStorage<{ domain: string }>();