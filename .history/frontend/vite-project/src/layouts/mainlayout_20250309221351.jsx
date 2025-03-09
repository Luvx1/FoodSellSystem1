import MainHeader from "../components/header/MainHeader";

export default function MainLayout({ children }) {
  return (
    <div>
      <MainHeader />
      {children
        ? children
        : <div>
          <h1>Content</h1>
        </div>
          }
          
    </div>
  );
}