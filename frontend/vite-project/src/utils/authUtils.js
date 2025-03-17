//filepath: c:\anhkhoi\Project\FoodSellSystem\frontend\vite-project\src\utils\authUtils.js
import Cookies from 'js-cookie';

export const login = (token) => {
    Cookies.set('userToken', token, { expires: 7 }); // Lưu token trong 7 ngày
};

export const logout = () => {
   Cookies.remove('userToken');
};