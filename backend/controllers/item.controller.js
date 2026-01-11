import uploadOnCloudinary from "../utils/cloudinary.js";
import Shop from "../models/shop.model.js";
import Item from "../models/item.model.js";

/* ================= ADD ITEM ================= */
export const addItem = async (req, res) => {
  try {
    const { name, category, price, foodType } = req.body;

    let image = null;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const item = await Item.create({
      name,
      category,
      price: Number(price),
      foodType,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      path: "items",
      options:{sort: { createdAt: -1 }}
    })

    return res.status(201).json(item);
  } catch (error) {
    console.error("ADD ITEM ERROR:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};


/* ================= EDIT ITEM (POST) ================= */
export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, price, foodType } = req.body;
    let image;

    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const updateData = {
      name,
      category,
      price,
      foodType,
    };

    if (image) {
      updateData.image = image;
    }

    const item = await Item.findByIdAndUpdate(itemId, updateData, {
      new: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate({
      path: "items",
      options:{sort: { createdAt: -1 }}
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({
      message: `Error editing item: ${error.message}`,
    });
  }
};

/* ================= GET ITEM BY ID ================= */
export const getItemById = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({
      message: `Error getting item: ${error.message}`,
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.items = shop.items.filter(
      (i) => i.toString() !== itemId
    );

    await shop.save();

    await shop.populate({
      path: "items",
      options: { sort: { createdAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({
      message: `Error deleting item: ${error.message}`,
    });
  }
};


