const router = require("express").Router();

const Product = require("../models/Product");

const multer = require("multer");

const storage = require("multer").memoryStorage();
const upload = multer({ storage: storage });

const sharp = require("sharp");

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    const updatedImageProducts = products.map((product) => {
      // console.log(product);
      const imageBuffer = product.image;
      console.log("typeof", product.image);
      const base64Image = product.image.toString("base64");
      return {
        _id: product._id,
        flavor: product.flavor,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: base64Image,
      };
    });

    res.status(200).json(updatedImageProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/products", upload.single("image"), async (req, res) => {
  console.log("body recieved", req.body);
  try {
    const { name, flavor, price, quantity } = req.body;
    const image = req.file.buffer;

    const newProduct = new Product({ name, flavor, image, price, quantity });
    console.log(newProduct);
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
