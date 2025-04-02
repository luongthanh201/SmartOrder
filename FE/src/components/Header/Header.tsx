import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
  };


  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Gogi House" />
          </Link>

          <div className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
            <ul>
              <li>
                <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/thuc-don" className={location.pathname === '/thuc-don' ? 'active' : ''}>
                  Thực đơn
                </Link>
              </li>
              <li>
                <Link to="/dat-ban" className={location.pathname === '/dat-ban' ? 'active' : ''}>
                  Đặt bàn
                </Link>
              </li>
              <li>
                <Link to="/qr-demo" className={location.pathname === '/qr-demo' ? 'active' : ''}>
                  Hướng dẫn QR
                </Link>
              </li>
            </ul>
          </nav>

          <div className="user-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="user-profile">
                  <span className="user-name">{currentUser?.name}</span>
                </Link>
                <button className="logout-btn" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link to="/login" className="login-btn">
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
