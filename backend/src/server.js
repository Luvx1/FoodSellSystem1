require('dotenv').config(); // Đảm bảo rằng dotenv được cấu hình đúng cách
const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});