import Shop from "../models/shop.model.js";
import Order from "../models/order.model.js";

export const placeOrder = async (req, res) => {
    try {
        const {cartItems,paymentMethod,deliveryAddress,totalAmount} = req.body;
        if(!cartItems || cartItems.length === 0){
            return res.status(400).json({message:"cart is empty"});
        }
        if(!deliveryAddress || !deliveryAddress.text || !deliveryAddress.latitude || !deliveryAddress.longitude){
            return res.status(400).json({message:"delivery address is incomplete"});
        }
        const groupItemsByShop={};
        cartItems.forEach((item)=>{
            const shopId=item.shop;
            if(!groupItemsByShop[shopId]){
                groupItemsByShop[shopId]=[];
             }
             groupItemsByShop[shopId].push(item);
        });
        const shopOrders=await Promise.all(Object.keys(groupItemsByShop).map(async(shopId)=>{
            const shop=await Shop.findById(shopId).populate("owner");
            if(!shop){
                return res.status(404).json({message:`shop with id ${shopId} not found`});
            }
            const items=groupItemsByShop[shopId];
            const subTotal=items.reduce((sum,item)=>sum+Number(item.price)*Number(item.quantity),0);
            return {
                shop:shop._id,
                owner:shop.owner._id,
                subTotal,
                shopOrderItems:items.map((item)=>({
                    item:item._id,
                    quantity:item.quantity,
                    price:item.price,
                    name:item.name,
                }))
            }
        }));
        const newOrder=await Order.create({
            user:req.userId,
            paymentMethod,
            deliveryAddress,
            totalAmount,
            shopOrders,
        });
        return res.status(201).json(newOrder);

    } catch (error) {
        res.status(500).json({message:`order placement failed ${error}`});
    }
}