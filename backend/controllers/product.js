// controllers/product.js
const Product = require('../models/Product');
const { storage } = require('../utils/Appwrite');
const { ID } = require('node-appwrite');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { default: mongoose } = require('mongoose');
const { Blob } = require('buffer');

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Tạo sản phẩm mới (POST)
const createProduct = async (req, res) => {
    const { name, description, price, category, image } = req.body;
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            category,
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
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại!' });
        }

        res.status(200).json({ message: 'Sản phẩm đã được xóa!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Upload product images (up to 5)
// Upload product images (up to 5)
const uploadProductImages = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Processing upload for product ID:', id);

        // Validate product ID format
        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID sản phẩm không hợp lệ',
            });
        }

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại!' });
        }

        // Check if files exist in request
        if (!req.files || !req.files.images) {
            return res.status(400).json({ success: false, message: 'Không có file nào được tải lên' });
        }

        // Convert files to array format
        let imageFiles = [];
        if (Array.isArray(req.files.images)) {
            imageFiles = req.files.images;
        } else {
            imageFiles = [req.files.images];
        }

        console.log(`Found ${imageFiles.length} images to upload`);

        // Check existing images + new uploads don't exceed limit
        const currentImageCount = product.images ? product.images.length : 0;
        if (currentImageCount + imageFiles.length > 5) {
            return res.status(400).json({
                success: false,
                message: `Sản phẩm chỉ được có tối đa 5 hình ảnh (hiện tại: ${currentImageCount})`,
            });
        }

        // Process each image
        const uploadResults = [];
        for (const file of imageFiles) {
            console.log(`Processing file: ${file.name}, size: ${file.size}, type: ${file.mimetype}`);

            // Validate file type
            if (!file.mimetype.startsWith('image/')) {
                return res.status(400).json({
                    success: false,
                    message: `File ${file.name} không phải là hình ảnh hợp lệ`,
                });
            }

            try {
                // Create temporary file path
                const tempFilePath = path.join(os.tmpdir(), file.name);

                // Move file to temp location
                await file.mv(tempFilePath);

                console.log(`Temp file created at: ${tempFilePath}`);
                console.log(`File exists: ${fs.existsSync(tempFilePath)}`);

                // Get file stats to confirm it was created correctly
                const stats = fs.statSync(tempFilePath);
                console.log(`File size: ${stats.size} bytes`);

                // Generate unique ID for file
                const fileId = ID.unique();

                // Use Blob with proper size and type instead of raw fs.createReadStream
                const fileBlob = new Blob([fs.readFileSync(tempFilePath)], {
                    type: file.mimetype,
                });

                console.log(`Generated Blob with size: ${fileBlob.size}`);

                // Upload file using the Blob
                const uploadedFile = await storage.createFile(
                    process.env.APPWRITE_BUCKET_ID,
                    fileId,
                    fileBlob,
                    file.name
                );

                console.log(`File uploaded successfully: ${uploadedFile.$id}`);

                // Clean up temp file
                fs.unlinkSync(tempFilePath);

                // Generate file URL
                const fileUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

                // Add URL to product's images array
                if (!product.images) product.images = [];
                product.images.push(fileUrl);

                // Add to results
                uploadResults.push({
                    fileId: uploadedFile.$id,
                    fileName: uploadedFile.name,
                    fileUrl,
                });
            } catch (error) {
                console.error(`Error uploading ${file.name}:`, error);
                throw new Error(`Error uploading ${file.name}: ${error.message}`);
            }
        }

        // Save updated product
        await product.save();
        console.log(`Product updated with ${uploadResults.length} new images`);

        res.status(200).json({
            success: true,
            message: `Đã tải lên thành công ${uploadResults.length} hình ảnh`,
            images: uploadResults,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xử lý tải lên hình ảnh',
            error: error.message,
        });
    }
};

// Delete product image
const deleteProductImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'URL hình ảnh không được cung cấp' });
        }

        // Check if product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại!' });
        }

        // Check if image URL exists in product's images
        if (!product.images || !product.images.includes(imageUrl)) {
            return res.status(404).json({ success: false, message: 'Hình ảnh không tồn tại trong sản phẩm' });
        }

        // Extract file ID from URL
        const fileIdMatch = imageUrl.match(/files\/([^\/]+)\/view/);
        if (!fileIdMatch || !fileIdMatch[1]) {
            return res.status(400).json({ success: false, message: 'Không thể xác định ID file từ URL' });
        }

        const fileId = fileIdMatch[1];

        // Delete file from Appwrite
        await storage.deleteFile(process.env.APPWRITE_BUCKET_ID, fileId);

        // Remove URL from product's images array
        product.images = product.images.filter((img) => img !== imageUrl);
        await product.save();

        res.status(200).json({
            success: true,
            message: 'Đã xóa hình ảnh thành công',
            remainingImages: product.images,
        });
    } catch (error) {
        console.error('Delete image error:', error);

        // Handle Appwrite document not found error
        if (error.code === 404) {
            try {
                // If file doesn't exist in Appwrite but URL is in product, remove it from product
                const { id } = req.params;
                const { imageUrl } = req.body;
                const product = await Product.findById(id);

                if (product && product.images) {
                    product.images = product.images.filter((img) => img !== imageUrl);
                    await product.save();

                    return res.status(200).json({
                        success: true,
                        message: 'Hình ảnh đã được xóa khỏi sản phẩm',
                        remainingImages: product.images,
                    });
                }
            } catch (innerError) {
                console.error('Error handling Appwrite 404:', innerError);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa hình ảnh',
            error: error.message,
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    deleteProductImage,
};
