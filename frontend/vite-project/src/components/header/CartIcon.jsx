import { useState, useEffect } from 'react';
import { Badge } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { getCartQuantity } from '../../utils/cartUtils'; // Hàm lấy số lượng giỏ hàng

const CartIcon = () => {
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        setCartCount(getCartQuantity());
    }, []);

    return (
        <Link to="/cart">
            <Badge count={cartCount} showZero>
                <ShoppingCartOutlined className="icon" />
            </Badge>
        </Link>
    );
};

export default CartIcon;
