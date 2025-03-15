import { useState } from "react";
import "./PlaceOrder.css"; // Import CSS
import { Link } from "react-router-dom";

const PlaceOrder = () => {
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Order Data:", formData);
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
                </form>
            </div>

            <div className="cart-summary">
                <h2>Cart Totals</h2>
                <div className="cart-total">
                    <p>Subtotal</p> <span>$0</span>
                </div>
                <div className="cart-total">
                    <p>Delivery Fee</p> <span>$2</span>
                </div>
                <div className="cart-total total">
                    <p>Total</p> <span>$2</span>
                </div>
                <Link to="/payment">
                    <button className="payment-button">PROCEED TO PAYMENT</button>
                </Link>
            </div>
        </div>
    );
};

export default PlaceOrder;
