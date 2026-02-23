import express from 'express';

import isAuth from '../middlewares/isAuth.js';
import { getDeliveryBoyAssignment, getMyOrders, placeOrder,updateOrderStatus,acceptOrder, getCurrentOrder } from '../controllers/order.controller.js';



const orderRouter = express.Router();

orderRouter.post("/place-order",isAuth,placeOrder);
orderRouter.get("/my-orders",isAuth,getMyOrders);
orderRouter.get("/get-asignment",isAuth,getDeliveryBoyAssignment);
orderRouter.get("/get-current-order",isAuth,getCurrentOrder);
orderRouter.post("/update-status/:orderId/:shopId",isAuth,updateOrderStatus);
orderRouter.get("/accept-order/:assignmentId",isAuth,acceptOrder);


export default orderRouter;