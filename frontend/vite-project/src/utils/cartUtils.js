import Cookies from 'js-cookie';

// Hàm lấy giỏ hàng từ cookie
export const getCart = () => {
    const cart = Cookies.get('cart');
    return cart ? JSON.parse(cart) : [];
};

// Hàm lưu giỏ hàng vào cookie
const saveCart = (cart) => {
    Cookies.set('cart', JSON.stringify(cart), { expires: 7 }); // Lưu trong 7 ngày
};

// Hàm thêm sản phẩm vào giỏ hàng
export const addToCart = (product) => {
    let cart = getCart();

    // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng thay vì thêm mới
        existingItem.quantity += product.quantity;
    } else {
        // Nếu chưa có, thêm mới
        cart.push(product);
    }

    saveCart(cart);
};

// Hàm xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (id) => {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== id);
    saveCart(cart);
};

// Hàm cập nhật số lượng sản phẩm
export const updateCartQuantity = (id, change) => {
    let cart = getCart();
    cart = cart.map((item) => {
        if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + change) }; // Không giảm dưới 1
        }
        return item;
    });
    saveCart(cart);
};

// Hàm lấy tổng số lượng sản phẩm trong giỏ hàng
export const getCartQuantity = () => {
    const cart = getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
};