import { useState, useEffect } from 'react';
import { useOrders, Order, OrderStatus } from '../../context/OrderContext';
import './KitchenDashboard.scss';

const KitchenDashboard = () => {
  const [selectedTab, setSelectedTab] = useState<'pending' | 'preparing' | 'ready' | 'completed'>('pending');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [estimatedTime, setEstimatedTime] = useState<Record<string, number>>({});

  const {
    orders,
    getOrdersByStatus,
    updateOrderStatus,
    updateOrderEstimatedTime,
    clearCompletedOrders
  } = useOrders();

  // When orders change, update UI
  useEffect(() => {
    // This effect will run whenever orders changes
  }, [orders]);

  const getOrdersForTab = () => {
    switch (selectedTab) {
      case 'pending':
        return getOrdersByStatus('pending');
      case 'preparing':
        return getOrdersByStatus('preparing');
      case 'ready':
        return getOrdersByStatus('ready');
      case 'completed':
        return getOrdersByStatus(['delivered', 'cancelled']);
      default:
        return [];
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple authentication (in a real app, this would use a secure API)
    if (username === 'kitchen' && password === 'kitchen123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    }
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);

    // If setting to preparing, use the estimated time if available
    if (newStatus === 'preparing' && estimatedTime[orderId]) {
      updateOrderEstimatedTime(orderId, estimatedTime[orderId]);
    }
  };

  const handleEstimatedTimeChange = (orderId: string, time: number) => {
    setEstimatedTime(prev => ({
      ...prev,
      [orderId]: time
    }));
  };

  const renderOrderItems = (order: Order) => {
    return (
      <div className="order-items">
        {order.items.map(item => (
          <div key={`${order.id}-${item.id}`} className="order-item">
            <span className="quantity">{item.quantity}x</span>
            <span className="name">{item.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderOrderCard = (order: Order) => {
    const timeDisplay = formatTime(order.timestamp);
    const dateDisplay = formatDate(order.timestamp);

    return (
      <div key={order.id} className={`order-card ${order.status}`}>
        <div className="order-header">
          <div className="order-info">
            <h3>Bàn số: {order.tableId}</h3>
            <p className="order-time">{timeDisplay} - {dateDisplay}</p>
          </div>
          <div className="order-status">
            <span className={`status-badge ${order.status}`}>
              {order.status === 'pending' && 'Chờ xử lý'}
              {order.status === 'preparing' && 'Đang chuẩn bị'}
              {order.status === 'ready' && 'Sẵn sàng phục vụ'}
              {order.status === 'delivered' && 'Đã phục vụ'}
              {order.status === 'cancelled' && 'Đã hủy'}
            </span>
          </div>
        </div>

        {renderOrderItems(order)}

        {order.note && (
          <div className="order-note">
            <span className="note-label">Ghi chú:</span>
            <span className="note-content">{order.note}</span>
          </div>
        )}

        <div className="order-total">
          <span>Tổng cộng:</span>
          <span>{order.total.toLocaleString()}đ</span>
        </div>

        <div className="order-actions">
          {selectedTab === 'pending' && (
            <>
              <div className="estimated-time">
                <label>Thời gian chuẩn bị (phút):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={estimatedTime[order.id] || 15}
                  onChange={(e) => handleEstimatedTimeChange(order.id, parseInt(e.target.value))}
                />
              </div>
              <button
                className="accept-btn"
                onClick={() => handleStatusChange(order.id, 'preparing')}
              >
                Chấp nhận
              </button>
              <button
                className="cancel-btn"
                onClick={() => handleStatusChange(order.id, 'cancelled')}
              >
                Từ chối
              </button>
            </>
          )}

          {selectedTab === 'preparing' && (
            <button
              className="ready-btn"
              onClick={() => handleStatusChange(order.id, 'ready')}
            >
              Sẵn sàng phục vụ
            </button>
          )}

          {selectedTab === 'ready' && (
            <button
              className="deliver-btn"
              onClick={() => handleStatusChange(order.id, 'delivered')}
            >
              Đã phục vụ
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="kitchen-login">
        <div className="login-container">
          <div className="login-header">
            <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Gogi House" className="logo" />
            <h1>Đăng nhập - Bếp</h1>
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
    );
  }

  const filteredOrders = getOrdersForTab();

  return (
    <div className="kitchen-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Gogi House" className="logo" />
              <h1>Quản lý đơn hàng</h1>
            </div>
            <button className="logout-btn" onClick={() => setIsAuthenticated(false)}>
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${selectedTab === 'pending' ? 'active' : ''}`}
              onClick={() => setSelectedTab('pending')}
            >
              Chờ xử lý
              {getOrdersByStatus('pending').length > 0 && (
                <span className="badge">{getOrdersByStatus('pending').length}</span>
              )}
            </button>
            <button
              className={`tab ${selectedTab === 'preparing' ? 'active' : ''}`}
              onClick={() => setSelectedTab('preparing')}
            >
              Đang chuẩn bị
              {getOrdersByStatus('preparing').length > 0 && (
                <span className="badge">{getOrdersByStatus('preparing').length}</span>
              )}
            </button>
            <button
              className={`tab ${selectedTab === 'ready' ? 'active' : ''}`}
              onClick={() => setSelectedTab('ready')}
            >
              Sẵn sàng phục vụ
              {getOrdersByStatus('ready').length > 0 && (
                <span className="badge">{getOrdersByStatus('ready').length}</span>
              )}
            </button>
            <button
              className={`tab ${selectedTab === 'completed' ? 'active' : ''}`}
              onClick={() => setSelectedTab('completed')}
            >
              Hoàn thành / Hủy
            </button>
          </div>

          <div className="orders-container">
            {selectedTab === 'completed' && (
              <div className="completed-actions">
                <button
                  className="clear-btn"
                  onClick={clearCompletedOrders}
                >
                  Xóa đơn hàng đã hoàn thành
                </button>
              </div>
            )}

            {filteredOrders.length === 0 ? (
              <div className="no-orders">
                <p>Không có đơn hàng nào {selectedTab === 'pending' ? 'đang chờ' : selectedTab === 'preparing' ? 'đang chuẩn bị' : selectedTab === 'ready' ? 'sẵn sàng phục vụ' : 'đã hoàn thành'}</p>
              </div>
            ) : (
              <div className="orders-grid">
                {filteredOrders.map(order => renderOrderCard(order))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KitchenDashboard;
