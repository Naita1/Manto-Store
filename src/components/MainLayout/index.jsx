import './MainLayout.css';


export function MainLayout({ children }) {
  return (
    <div className="main-layout-container">
      <div className="background-image-layer" />
      
      <div className="background-overlay-layer" />

      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}