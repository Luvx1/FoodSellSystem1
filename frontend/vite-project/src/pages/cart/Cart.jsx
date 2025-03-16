import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { getCart, removeFromCart, updateCartQuantity } from '../../utils/cartUtils';
import './Cart.css';
import { Link } from "react-router-dom";
import { routes } from "../../routes";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

    // Load giỏ hàng từ cookies khi component mount
    useEffect(() => {
        setCartItems(getCart());
    }, []);

    // Xóa sản phẩm khỏi giỏ hàng
    const handleRemove = (id) => {
        removeFromCart(id);
        setCartItems(getCart()); // Cập nhật lại state
    };

    // Tăng số lượng sản phẩm
    const increaseQuantity = (id) => {
        updateCartQuantity(id, 1);
        setCartItems(getCart());
    };

    // Giảm số lượng sản phẩm
    const decreaseQuantity = (id) => {
        updateCartQuantity(id, -1);
        setCartItems(getCart());
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 2 : 0;
    const total = subtotal + deliveryFee;

    // Lưu tổng tiền vào cookies và điều hướng đến trang thanh toán
    const handleProceedToCheckout = () => {
        Cookies.set("cartTotal", total.toFixed(2), { expires: 1 }); // Lưu tổng tiền trong 1 ngày
        navigate(routes.placeOrder);
    };

    return (
        <div className="cart-container">
            {cartItems.length === 0 ? (
                <div className="cart-empty-container">
                    <p className="cart-empty">Your cart is empty.</p>
                    <button className="view-menu-btn" onClick={() => (window.location.href = '/product')}>
                        View Menu
                    </button>
                </div>
            ) : (
                <>
                    <table className="cart-table">
                        <thead>
                            <tr>
                                <th>Items</th>
                                <th>Title</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, index) => (
                                <tr key={item.id || index}>
                                    <td>
                                        <img src={item.image} alt={item.title} className="cart-item-img" />
                                    </td>
                                    <td>{item.name}</td>
                                    <td>${item.price}</td>
                                    <td>
                                        <button onClick={() => decreaseQuantity(item.id)} className="quantity-btn">
                                            -
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button onClick={() => increaseQuantity(item.id)} className="quantity-btn">
                                            +
                                        </button>
                                    </td>
                                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                                    <td>
                                        <button onClick={() => handleRemove(item.id)} className="cart-remove-btn">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="cart-summary">
                        <div className="cart-totals">
                            <h2>Cart Totals</h2>
                            <div className="cart-total-details">
                                <p>
                                    <span>Subtotal</span> <span>${subtotal.toFixed(2)}</span>
                                </p>
                                <p>
                                    <span>Delivery Fee</span> <span>${deliveryFee.toFixed(2)}</span>
                                </p>
                                <p className="cart-total">
                                    <span>Total</span> <span>${total.toFixed(2)}</span>
                                </p>
                            </div>
                            <button onClick={handleProceedToCheckout} className={`checkout-btn ${cartItems.length === 0 ? "disabled" : ""}`}>
                                PROCEED TO CHECKOUT
                            </button>
                        </div>

                        <div className="promo-code">
                            <p>If you have a promo code, enter it here</p>
                            <div className="promo-input">
                                <input type="text" placeholder="Promo Code" />
                                <button>Submit</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;