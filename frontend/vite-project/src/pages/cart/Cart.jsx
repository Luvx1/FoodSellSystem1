import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import './Cart.css'; // Import CSS

const Cart = () => {
    const [cartItems, setCartItems] = useState([
        { id: 1, title: 'Burger', price: 5, quantity: 1 },
        { id: 2, title: 'Fries', price: 3, quantity: 2 },
    ]);

    const handleRemove = (id) => {
        setCartItems(cartItems.filter((item) => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = subtotal > 0 ? 2 : 0;
    const total = subtotal + deliveryFee;

    return (
        <div className="cart-container">
            {/* Table */}
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
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <img
                                    src={`/images/${item.title.toLowerCase()}.png`}
                                    alt={item.title}
                                    className="cart-item-img"
                                />
                            </td>
                            <td>{item.title}</td>
                            <td>${item.price}</td>
                            <td>{item.quantity}</td>
                            <td>${item.price * item.quantity}</td>
                            <td>
                                <button onClick={() => handleRemove(item.id)} className="cart-remove-btn">
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Cart Totals & Promo Code */}
            <div className="cart-summary">
                <div className="cart-totals">
                    <h2>Cart Totals</h2>
                    <div className="cart-total-details">
                        <p>
                            <span>Subtotal</span> <span>${subtotal}</span>
                        </p>
                        <p>
                            <span>Delivery Fee</span> <span>${deliveryFee}</span>
                        </p>
                        <p className="cart-total">
                            <span>Total</span> <span>${total}</span>
                        </p>
                    </div>
                    <button className="checkout-btn">PROCEED TO CHECKOUT</button>
                </div>

                <div className="promo-code">
                    <p>If you have a promo code, enter it here</p>
                    <div className="promo-input">
                        <input type="text" placeholder="Promo Code" />
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
