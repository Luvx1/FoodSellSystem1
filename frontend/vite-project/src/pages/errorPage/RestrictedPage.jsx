import { useNavigate } from 'react-router-dom';
import { FaLock, FaHome } from 'react-icons/fa';

export default function RestrictedPage() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 px-4">
            <div className="text-center bg-white rounded-xl shadow-2xl p-8 max-w-md border border-gray-100 transform transition-all hover:scale-[1.01]">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-6 rounded-full shadow-inner border border-red-200 animate-pulse">
                        <FaLock className="text-red-500 text-6xl" />
                    </div>
                </div>

                <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
                    <span className="text-red-500">403</span> - Access Forbidden
                </h1>

                <div className="h-1 w-20 bg-red-400 mx-auto mb-6 rounded-full"></div>

                <p className="text-gray-600 mb-8 text-lg">
                    Sorry, you don't have permission to access this page. Please contact an administrator if you believe
                    this is an error.
                </p>

                <button
                    onClick={handleGoHome}
                    className="flex items-center justify-center gap-2 mx-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <FaHome className="text-lg" />
                    <span>Return to Home</span>
                </button>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Food Sell System. All rights reserved.
            </p>
        </div>
    );
}
