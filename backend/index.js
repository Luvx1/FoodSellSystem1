require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Kết nối MongoDB
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('✅ Kết nối MongoDB thành công!'))
    .catch((err) => console.error('❌ Không thể kết nối MongoDB:', err.message));

// Enable CORS for all routes
app.use(cors());

app.use(express.json());
app.use(
    fileUpload({
        limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
        useTempFiles: true,
    })
);

app.use('/auth', require('./routes/auth'));
// Routes
app.use('/products', require('./routes/product'));

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
