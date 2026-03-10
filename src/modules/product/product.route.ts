import { Router } from 'express';
import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from './product.controller';
import { authMmo } from '../../middlewares/authMmo';
import { checkPermissionMmo } from '../../middlewares/checkPermissionMmo';
import validate from '../../middlewares/validate';
import { createProductValidation, updateProductValidation } from './product.validation';

const router = Router();

router.use(authMmo());

router.post('/', checkPermissionMmo(['ADMIN']), validate(createProductValidation), createProduct);
// Staff có thể xem sản phẩm để bán, User cũng có thể xem
router.get('/', getProducts);
router.get('/:id', getProduct);
router.put('/:id', checkPermissionMmo(['ADMIN']), validate(updateProductValidation), updateProduct);
router.delete('/:id', checkPermissionMmo(['ADMIN']), deleteProduct);

export default router;
