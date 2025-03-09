import { Outlet } from 'react-router-dom';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';

export default function MainLayout() {
    return (
        <Flex gap="middle" wrap> 
            <MainHeader />
            <div className="main-content">
                <Outlet />
            </div>
            <MainFooter />
        </div>
    );
}
