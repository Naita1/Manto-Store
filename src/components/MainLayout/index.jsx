import './MainLayout.css';

export function MainLayout({ children }) {
  return (
    <div className="main-layout-container">
      <div className="background-image-layer" aria-hidden="true" />
      <div className="background-overlay-layer" aria-hidden="true" />
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
}