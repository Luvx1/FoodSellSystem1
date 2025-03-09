import { Outlet } from 'react-router-dom';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';

export default function MainLayout({ children }) {
    return (
        <div>
            <MainHeader />
            {children ? (
                children
            ) : (
                <div>
                    
                    <Outlet />
                </div>
            )}
            <MainFooter />
        </div>
    );
}
