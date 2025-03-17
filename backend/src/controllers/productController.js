const Product = require("../models/product");

const ProductController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra ID có hợp lệ không
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID không hợp lệ!" });
            }

            const product = await Product.findById(id);
            if (!product) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }

            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createProduct: async (req, res) => {
        try {
            const newProduct = new Product(req.body);
            await newProduct.save();
            res.status(201).json(newProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra ID có hợp lệ không
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID không hợp lệ!" });
            }

            const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedProduct) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }
            res.status(200).json(updatedProduct);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const { id } = req.params;

            // Kiểm tra ID có hợp lệ không
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: "ID không hợp lệ!" });
            }

            const deletedProduct = await Product.findByIdAndDelete(id);
            if (!deletedProduct) {
                return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
            }
            res.status(200).json({ message: "Sản phẩm đã được xóa" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = ProductController;