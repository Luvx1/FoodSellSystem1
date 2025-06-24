import './AboutUs.css';
import { useLanguage } from '../../LanguageContext';

const aboutUsContent = {
    en: {
        title: 'ABOUT US',
        aboutBrandTitle: 'About StreetFoodSpencer®',
        aboutBrandDesc: `Every day, countless guests visit StreetFoodSpencer to enjoy high-quality, delicious, and
                        affordable food. Founded in early 2024, StreetFoodSpencer is committed to using premium
                        ingredients, unique recipes, and creating a friendly, welcoming dining experience. Although we
                        are a young brand, our passion for great food and customer satisfaction drives us to become a
                        favorite destination for food lovers.`,
        aboutSfsTitle: 'About SFS',
        aboutSfsDesc: `StreetFoodSpencer® was established in early 2024 with the vision of bringing high-quality,
                        delicious, and affordable street food to everyone. With a passion for food and customer
                        satisfaction, we are rapidly expanding, driven by a dedicated and experienced team. Our
                        commitment to exceptional service and authentic flavors positions StreetFoodSpencer as a go-to
                        destination for food lovers. As we grow, we aim to become a leading name in the street food
                        industry, delivering an unforgettable dining experience to our customers.`
    },
    vn: {
        title: 'VỀ CHÚNG TÔI',
        aboutBrandTitle: 'Về StreetFoodSpencer®',
        aboutBrandDesc: `Mỗi ngày, hàng ngàn thực khách ghé thăm StreetFoodSpencer để thưởng thức những món ăn chất lượng cao, thơm ngon và giá cả hợp lý. Được thành lập đầu năm 2024, StreetFoodSpencer cam kết sử dụng nguyên liệu cao cấp, công thức độc đáo và tạo ra trải nghiệm ẩm thực thân thiện, chào đón. Dù là thương hiệu trẻ, niềm đam mê với ẩm thực và sự hài lòng của khách hàng là động lực để chúng tôi trở thành điểm đến yêu thích của những người yêu ẩm thực.`,
        aboutSfsTitle: 'Về SFS',
        aboutSfsDesc: `StreetFoodSpencer® được thành lập đầu năm 2024 với tầm nhìn mang ẩm thực đường phố chất lượng cao, thơm ngon và giá hợp lý đến với mọi người. Với niềm đam mê ẩm thực và sự hài lòng của khách hàng, chúng tôi không ngừng mở rộng, được dẫn dắt bởi đội ngũ tận tâm và giàu kinh nghiệm. Cam kết dịch vụ xuất sắc và hương vị đích thực giúp StreetFoodSpencer trở thành điểm đến lý tưởng cho người yêu ẩm thực. Chúng tôi hướng tới trở thành tên tuổi hàng đầu trong ngành ẩm thực đường phố, mang đến trải nghiệm khó quên cho khách hàng.`
    }
};

const AboutUs = () => {
    const { lang } = useLanguage();
    const content = aboutUsContent[lang] || aboutUsContent.en;
    return (
        <div className="about-us-container">
            <div className="about-us-card">
                <h2 className="about-us-title">{content.title}</h2>
                <hr className="about-us-divider" />
                <div className="about-us-content">
                    <h3>{content.aboutBrandTitle}</h3>
                    <p>{content.aboutBrandDesc}</p>

                    <h3>{content.aboutSfsTitle}</h3>
                    <p>{content.aboutSfsDesc}</p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
