import uploadOnCloudinary from "../utils/cloudinary";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";
export const addItem=async (req,res)=>{
try {
    const {name,category,price,foodType}=req.body;
    let image;
    if(req.file){
        image= await uploadOnCloudinary(req.file.path);
    }
    const shop= await Shop.findOne({owner:req.userId});
    if(!shop)
    {
        return req.status(404).json({message:"Shop not found"});
    }
    const Item= await Item.create({
        name,category,price,foodType,image,shop:shop._id
    })
    return res.status(201).json(Item);  
} catch (error) {
    res.status(500).json({message:`Error adding item: ${error}`});
}
}

export const editItem=async (req,res)=>{
    try {
        const {itemId}=req.params;
        const {name,category,price,foodType}=req.body;
        let image;
        if(req.file){
            image= await uploadOnCloudinary(req.file.path);
        }
        const item= await item.findByIdAndUpdate(itemId,{
            name,category,price,foodType,image
        },{new:true});
        return res.status(200).json(item);  
        if(!item){
            return res.status(400).json({message:"Item not found"});
        }
    } catch (error) {
        res.status(500).json({message:`Error editing item: ${error}`});
    }
}