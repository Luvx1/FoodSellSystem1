// controllers/product.js
const Product = require('../models/Product');

// Tạo sản phẩm mới (POST)
const createProduct = async (req, res) => {
    const { name, description, price, category, image } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            image,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Sản phẩm đã được tạo!', product: newProduct });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Lấy tất cả sản phẩm (GET)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Lấy sản phẩm theo ID (GET)
const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Cập nhật sản phẩm (PUT)
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image } = req.body;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.image = image || product.image;

        await product.save();
        res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', product });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Xóa sản phẩm (DELETE)
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        await product.remove();
        res.status(200).json({ message: 'Sản phẩm đã được xóa!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
};
