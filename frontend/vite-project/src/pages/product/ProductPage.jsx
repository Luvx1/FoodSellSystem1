import ProductCard from '../../components/productCard/ProductCard';
import './ProductPage.css';
import cheeseRingBurger from '../../assets/image/cheese-ring-burger.jpg';
import cheeseBeefBurger from '../../assets/image/burger3.jpg';
import cheeseBaconBurger from '../../assets/image/double-bbq-bacon-cheese.jpg';
import cheeseRingBeefBurger from '../../assets/image/cheese-ring-beef-burger-jr-combo.jpg';
export default function ProductPage() {
    var product = [
        {
            name: 'CHEESE RING BURGER (New)',
            price: '200',
            image: cheeseRingBurger,
        },
        {
            name: 'CHEESE BEEF BURGER',
            price: '200',
            image: cheeseBeefBurger,
        },
        {
            name: 'CHEESE BACON BURGER',
            price: '200',
            image: cheeseBaconBurger,
        },
        {
            name: 'CHEESE RING BEEF BURGER',
            price: '200',
            image: cheeseRingBeefBurger,
        },
        
    ];
    return (
        <div style={{ padding: '20px', maxWidth: '1440px', margin: 'auto' }}>
            <h1>Product Page</h1>
            <div className="wrapper-product">
                {product.map((product) => (
                    <ProductCard product={product} />
                ))}
            </div>
        </div>
    );
}
