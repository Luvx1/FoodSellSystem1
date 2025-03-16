import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "./PlaceOrder.css";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        phone: "",
    });
    
    const [total, setTotal] = useState(2); // Default to delivery fee
    
    useEffect(() => {
        const savedTotal = Cookies.get("cartTotal");
        if (savedTotal) {
            setTotal(parseFloat(savedTotal) + 2); // Add delivery fee
        }
    }, []);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Kiểm tra nếu có trường nào bị bỏ trống
        for (const key in formData) {
            if (!formData[key]) {
                alert("Please fill in all fields.");
                return;
            }
        }
        
        Cookies.set("orderInfo", JSON.stringify(formData), { expires: 1 });
        navigate("/payment");
    };

    return (
        <div className="place-order-container">
            <div className="delivery-info">
                <h2>Delivery Information</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <input type="text" name="firstName" placeholder="First name" onChange={handleChange} />
                        <input type="text" name="lastName" placeholder="Last name" onChange={handleChange} />
                    </div>
                    <input type="email" name="email" placeholder="Email address" onChange={handleChange} />
                    <input type="text" name="street" placeholder="Street" onChange={handleChange} />
                    <div className="form-row">
                        <input type="text" name="city" placeholder="City" onChange={handleChange} />
                        <input type="text" name="state" placeholder="State" onChange={handleChange} />
                    </div>
                    <div className="form-row">
                        <input type="text" name="zipCode" placeholder="Zip code" onChange={handleChange} />
                        <input type="text" name="country" placeholder="Country" onChange={handleChange} />
                    </div>
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} />
                    <button type="submit" className="payment-button">PROCEED TO PAYMENT</button>
                </form>
            </div>

            <div className="cart-summary">
                <h2>Cart Totals</h2>
                <div className="cart-total">
                    <p>Subtotal</p> <span>${(total - 2).toFixed(2)}</span>
                </div>
                <div className="cart-total">
                    <p>Delivery Fee</p> <span>$2.00</span>
                </div>
                <div className="cart-total total">
                    <p>Total</p> <span>${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;