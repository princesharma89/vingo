import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import DeliveryAssignment from "../models/deliveryAssigment.model.js";

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

    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price",
    );
    await newOrder.populate("shopOrders.shop", "name");

    return res.status(201).json(newOrder);
  } catch (error) {
    return res.status(500).json({ message: `order placement failed ${error}` });
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
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy","fullName email mobile");

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

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (o) => o.shop?.toString() == shopId,
    );
    if (!shopOrder) {
      return res.status(400).json({ message: "shop order not found" });
    }

    shopOrder.status = status;
    let deliveryBoysPayload=[];
    if (status === "ready for pickup" && !shopOrder.assignment) 
      {
      const { latitude, longitude } = order.deliveryAddress;
      const nearByDeliveryBoys = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000, // 5km area
          },
        },
      });
      const nearByIds = nearByDeliveryBoys.map((d) => d._id);
      const busyIds = await DeliveryAssignment.find({
        assignedTo: { $in: nearByIds },
        status: { $nin: ["broadcasted", "completed"] },
      }).distinct("assignedTo");
      const busyIdSet = new Set(busyIds.map((id) => String(id)));
      const availableBoys = nearByDeliveryBoys.filter(
        (d) => !busyIdSet.has(String(d._id)),
      );
      const candidates = availableBoys.map((b) => b._id);
      if (candidates.length == 0) {
        await order.save();
        return res.json({
          message:
            "order status is updated but there is no available delivery boys",
        });
      }
    
    const deliveryAssignment = await DeliveryAssignment.create({
      order: order._id,
      shop: shopOrder.shop,
      shopOrderId: shopOrder._id,
      broadcatedTo: candidates,
      status: "broadcasted",
    });
    shopOrder.assignedDeliveryBoy= deliveryAssignment.assignedTo;
    shopOrder.assignment = deliveryAssignment._id;
    deliveryBoysPayload=availableBoys.map((b) => ({
      id:b._id,
      name:b.fullName,
      mobile:b.mobile,
      longitude:b.location.coordinates?.[0],
      latitude:b.location.coordinates?.[1],
     })
    );

  }
    await shopOrder.save();
    await order.save();
    const updatedShopOrder = order.shopOrders.find((o) => o.shop== shopId);
    await order.populate("shopOrders.shop", "name");
   await order.populate("shopOrders.assignedDeliveryBoy","fullName email mobile")

   

    return res.status(200).json({
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy,
      availableBoys: deliveryBoysPayload,
      assignmentId: updatedShopOrder?.assignment._id,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `updating order status failed ${error}` });
  }
};
export const getDeliveryBoyAssignment = async (req,res)=>{
        try {
          const deliveryBoyId = req.userId;
          const assignments = await DeliveryAssignment.find({
            broadcatedTo: deliveryBoyId,
            status: "broadcasted",
          })
          .populate("order")
          .populate("shop")
          
          const formated=assignments.map(a=>{
            if(!a.order || !a.shop){
              return null;
            }
            const shopOrder = a.order.shopOrders?.find(so=>so._id.toString()===a.shopOrderId.toString());
            return {
              assignmentId:a._id,
              orderId: a.order._id,
              shopName: a.shop.name,
              deliveryAddress: a.order.deliveryAddress,
              items: shopOrder?.shopOrderItems || [],
              subTotal: shopOrder?.subTotal || 0,
            }
          }).filter(a=>a!==null);
          
          return res.status(200).json(formated);
        } catch (error) {
          console.error('get assignment error:', error);
          return res.status(500).json({ message: 'get assignment error', error: error.message});
        }
}
export const acceptOrder= async (req,res)=>{
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if(!assignment){
      return res.status(404).json({ message: "assignment not found" });
    }
    if(assignment.status !== "broadcasted"){
      return res.status(400).json({ message: "assignment is expired" });
    }
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $nin: ["completed", "cancelled","broadcasted"] },
    })
    if(alreadyAssigned){
      return res.status(400).json({ message: "you already have an active assignment" });
    }
    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();
    const order=await Order.findById(assignment.order);
    if(!order){
      return res.status(404).json({ message: "order not found" });
    }
    const shopOrder=order.shopOrders.find(so=>so._id.toString()===assignment.shopOrderId.toString());
    shopOrder.assignedDeliveryBoy=req.userId;
    await order.save();
    return res.status(200).json({ message: "assignment accepted successfully" });
  } catch (error) {
    console.error("Error accepting assignment:", error);
    return res.status(500).json({ message: "Error accepting assignment", error: error.message });
  }
}
export const getCurrentOrder= async (req,res)=>{
  try {
    const assignment = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
    .populate("shop","name")
    .populate("assignedTo","fullName email mobile location")
    .populate({
      path:"order",
      populate:[
        {path:"user", select:"fullName email mobile location"},
        {path:"shopOrders.shop", select:"name"}
      ]
    })
    if(!assignment){
      return res.status(404).json({ message: "no active assignment found" });
    }
    if(!assignment.order){
      return res.status(404).json({ message: "order not found" });
    }
      const shopOrder = assignment.order.shopOrders?.find(so=>so._id.toString()===assignment.shopOrderId.toString());
      if(!shopOrder){
        return res.status(404).json({ message: "shop order not found" });
      }
      let deliveryBoyLocation={lat:null,lng:null};
      if(assignment.assignedTo.location.coordinates.length===2){
        deliveryBoyLocation.lat=assignment.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lng=assignment.assignedTo.location.coordinates[0];
      }
      
      let customerLocation={lat:null,lng:null};
      if(assignment.order.user.location.coordinates.length===2){
      customerLocation.lat=assignment.order.user.location.coordinates[1];
      customerLocation.lng=assignment.order.user.location.coordinates[0];
      }
      return res.status(200).json({
        _id: assignment._id,
        user: assignment.order.user,
        shop: assignment.shop,
        shopOrder,
        deliveryAddress: assignment.order.deliveryAddress,
        deliveryBoyLocation,
        customerLocation,
      })
  } catch (error) {
    return res.status(500).json({ message: "Error fetching current order", error: error.message });
  }
}
