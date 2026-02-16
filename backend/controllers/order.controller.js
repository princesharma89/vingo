import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, paymentMethod, deliveryAddress, totalAmount } = req.body;
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }
    if (
      !deliveryAddress ||
      !deliveryAddress.text ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      return res
        .status(400)
        .json({ message: "delivery address is incomplete" });
    }
    const groupItemsByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupItemsByShop[shopId]) {
        groupItemsByShop[shopId] = [];
      }
      groupItemsByShop[shopId].push(item);
    });
    const shopOrders = await Promise.all(
      Object.keys(groupItemsByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) {
          return res
            .status(404)
            .json({ message: `shop with id ${shopId} not found` });
        }
        const items = groupItemsByShop[shopId];
        const subTotal = items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0,
        );
        return {
          shop: shop._id,
          owner: shop.owner._id,
          subTotal,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
          })),
        };
      }),
    );
    const newOrder = await Order.create({
      user: req.userId,
      paymentMethod,
      deliveryAddress,
      totalAmount,
      shopOrders,
    });
    await newOrder.populate("shopOrders.shopOrderItems.item", "name image price");
    await newOrder.populate("shopOrders.shop", "name");
    return res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: `order placement failed ${error}` });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.role === "user") {
      const orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("shopOrders.owner", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");

      return res.status(200).json(orders);
    } else if (user.role === "owner") {
      const orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .populate("shopOrders.shop", "name")
        .populate("user", "fullName email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");
      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        paymentMethod: order.paymentMethod,
        user: order.user,
        deliveryAddress: order.deliveryAddress,
        shopOrders: order.shopOrders.filter(
          (so) => so.owner._id.toString() === req.userId,
        ),
        createdAt: order.createdAt,
      }));

      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    return res.status(500).json({ message: `fetching order failed ${error}` });
  }
};

export const updateOrderStatus= async(req,res)=>{
  try {
    const {orderId,shopId}=req.params;
    const {status}=req.body;
    
    if(!status){
      return res.status(400).json({message:"status is required"})
    }
    
    const order = await Order.findById(orderId);
    if(!order){
      return res.status(404).json({message:"Order not found"})
    }

    const shopOrder = order.shopOrders.find(o=>o.shop?.toString()==shopId)
    if(!shopOrder){
      return res.status(400).json({message:"shop order not found"})
    }
    shopOrder.status=status;
    await order.save();
    return res.status(200).json(shopOrder.status);
  } catch (error) {
    return res.status(500).json({message:`updating order status failed ${error}`})
  }
}