import express from 'express';
import { auth } from '../../../middlewares/auth';
import {
    addUpdatedByIdToBody,
} from '../../../middlewares/addUserToBody'
import {validate} from '../../../middlewares/validate';
import {historyController} from './history.controller';
import {historyValidation} from './history.validation';

const router = express.Router()

router
    .route('/')
    .get(validate(historyValidation.getList),historyController.getList);

router
    .route('/count')
    .get(validate(historyValidation.getCountNoRead),historyController.getCountNoRead);

router.route('/all').get(validate(historyValidation.getAll),historyController.getAll);

router
    .route('/:historyId')
    .get(validate(historyValidation.getOne), historyController.getOne)
    .patch(auth(), addUpdatedByIdToBody, validate(historyValidation.updateOne), historyController.updateOne);

export const historyRoute = router;

/**
 * @swagger
 * tags:
 *   name: history
 *   description: history management and retrieval
 */

/**
 * @swagger
 * /history:
 *   post:
 *     summary: Create a history
 *     description: history create a history.
 *     tags: [history]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           :
 *             type: object
 *             required:
 *               - fullName
 *               - classId
 *             properties:
 *               CODE:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               fullName:
 *                 type: string
 *               avatar:
 *                 type: string
 *               birthday:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               historyId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               historyId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: Created
 *         content:
 *           application/json:
 *             :
 *                $ref: '#/components/s/history'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *   get:
 *     summary: Get list historys
 *     description: Only admins can retrieve all historys.
 *     tags: [history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         :
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         :
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of historys
 *       - in: query
 *         name: page
 *         :
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             :
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/s/history'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /history/all:
 *   get:
 *     summary: Get all historys
 *     description: Only admins can retrieve all historys.
 *     tags: [history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             :
 *               type: array
 *               $ref: '#/components/s/history'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /history/{historyId}:
 *   get:
 *     summary: get history
 *     description:
 *     tags: [history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: historyId
 *         required: true
 *         :
 *           type: string
 *         description: get history
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             :
 *               $ref: '#/components/s/history'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   patch:
 *     summary: Update a history
 *     description: update history
 *     tags: [history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: historyId
 *         required: true
 *         :
 *           type: string
 *         description: historyId id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           :
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               fullName:
 *                 type: string
 *               avatar:
 *                 type: string
 *               birthday:
 *                 type: string
 *               country:
 *                 type: string
 *               address:
 *                 type: string
 *               historyId:
 *                 type: string
 *             example:
 *               email: fake@example.com
 *               phone: 0358849971
 *               fullName: fake name
 *               historyName: fake historyName
 *               avatar: image.png
 *               birthday: 08/02/2023
 *               country: Ha Noi
 *               address: Ha Noi
 *               historyId: 655b2218fb4d3fadb64ed673
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             :
 *                $ref: '#/components/s/history'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     summary: Delete a history
 *     description: delete history.
 *     tags: [history]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: historyId
 *         required: true
 *         :
 *           type: string
 *         description: history id
 *     responses:
 *       "200":
 *         description: successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
