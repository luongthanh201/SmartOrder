import { useState } from 'react';
import QrCodeGenerator from '../../components/QrCodeGenerator/QrCodeGenerator';
import './Admin.scss';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple authentication (in a real app, this would use a secure API)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login-page">
        <div className="container">
          <div className="login-box">
            <div className="login-header">
              <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Gogi House" className="logo" />
              <h1>Đăng nhập quản trị</h1>
            </div>

            <form onSubmit={handleLogin}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Đăng nhập
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <h1>Quản lý nhà hàng</h1>
            <button
              className="logout-btn"
              onClick={() => setIsAuthenticated(false)}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-tabs">
            <div className="tab active">Mã QR đặt món</div>
            <div className="tab">Quản lý đơn hàng</div>
            <div className="tab">Quản lý thực đơn</div>
            <div className="tab">Thống kê</div>
          </div>

          <div className="admin-tab-content">
            <QrCodeGenerator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
