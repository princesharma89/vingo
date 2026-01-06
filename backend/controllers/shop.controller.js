import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => {
  try {
    const { name, city, state, address } = req.body;

    let image;
    if (req.file) {
      const uploadedImage = await uploadOnCloudinary(req.file.path);
      image = uploadedImage?.secure_url || uploadedImage;
    }

    let shop = await Shop.findOne({ owner: req.userId });

    if (!shop) {
      // CREATE
      shop = await Shop.create({
        name,
        city,
        state,
        address,
        image,
        owner: req.userId,
      });
    } else {
      // UPDATE (keep old image if new not uploaded)
      shop = await Shop.findByIdAndUpdate(
        shop._id,
        {
          name,
          city,
          state,
          address,
          ...(image && { image }),
        },
        { new: true }
      );
    }

    await shop.populate("owner");

    return res.status(shop.isNew ? 201 : 200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Error creating/updating shop: ${error.message}` });
  }
};

export const getMyShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ owner: req.userId }).populate('owner items');
    if(!shop){
      return null;
    }
    res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `get my shop error: ${error}` });
  }
}