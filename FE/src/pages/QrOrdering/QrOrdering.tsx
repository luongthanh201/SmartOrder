import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import menuItems, { categoryOrder, MenuItem } from '../../data/menuData';
import { useOrders, OrderItem } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import FloatingCart from '../../components/FloatingCart/FloatingCart';
import './QrOrdering.scss';

// Group menu items by category
const groupMenuItemsByCategory = () => {
  const grouped: Record<string, MenuItem[]> = {};

  menuItems.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  return grouped;
};

// Get popular items
const getPopularItems = () => {
  return menuItems.filter(item => item.popular);
};

const QrOrdering = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [note, setNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('popular');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [showCartSection, setShowCartSection] = useState(false);
  const [showAddedAnimation, setShowAddedAnimation] = useState<number | null>(null);
  const groupedMenu = groupMenuItemsByCategory();
  const categories = ['popular', ...categoryOrder];
  const navigate = useNavigate();
  const cartSectionRef = useRef<HTMLDivElement>(null);

  // Get order functions from context
  const {
    addOrder,
    getActiveOrderForTable,
    orders
  } = useOrders();

  // Get auth functions
  const { isAuthenticated, currentUser, updateUserOrders } = useAuth();

  // State to display items based on selected category
  const [displayedItems, setDisplayedItems] = useState<MenuItem[]>([]);

  // Check for active order when component mounts
  useEffect(() => {
    if (tableId) {
      const activeOrder = getActiveOrderForTable(tableId);
      if (activeOrder) {
        // Store the active order ID and status
        setOrderStatus(activeOrder.status);
        setOrderPlaced(true);

        // Set cart items from the active order for display
        setCart(activeOrder.items);
        setNote(activeOrder.note || '');
      }
    }
  }, [tableId, getActiveOrderForTable, orders]);

  useEffect(() => {
    if (selectedCategory === 'popular') {
      setDisplayedItems(getPopularItems());
    } else {
      setDisplayedItems(groupedMenu[selectedCategory] || []);
    }
  }, [selectedCategory, groupedMenu]);

  const addToCart = (item: MenuItem) => {
    if (orderPlaced) return; // Don't allow adding to cart if order is already placed

    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prevCart, { ...item, quantity: 1 }];
    });

    // Show animation feedback
    setShowAddedAnimation(item.id);
    setTimeout(() => setShowAddedAnimation(null), 500);
  };

  const removeFromCart = (id: number) => {
    if (orderPlaced) return; // Don't allow removing from cart if order is already placed

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === id);

      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      return prevCart.filter(item => item.id !== id);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleOrder = () => {
    if (!tableId || cart.length === 0) return;

    // Add the order using the context
    const newOrderId = addOrder({
      tableId,
      items: cart,
      total: calculateTotal(),
      note: note || undefined,
      timestamp: new Date().toISOString()
    });

    setOrderStatus('pending');
    setOrderPlaced(true);

    // If user is authenticated, add the order to their profile
    if (isAuthenticated && currentUser) {
      updateUserOrders(newOrderId);
    }

    // For debug only
    console.log(`New order created with ID: ${newOrderId}`);

    alert(`Đặt món thành công! Bàn số ${tableId}. Nhân viên sẽ mang món ăn đến cho bạn trong giây lát.`);
  };

  const handleNewOrder = () => {
    // Reset the form to create a new order
    setCart([]);
    setNote('');
    setOrderPlaced(false);
    setOrderStatus(null);
  };

  const handleLogin = () => {
    navigate('/login', { state: { from: { pathname: `/order/${tableId}` } } });
  };

  const toggleCartSection = () => {
    setShowCartSection(!showCartSection);
    if (!showCartSection && cartSectionRef.current) {
      setTimeout(() => {
        cartSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const renderOrderStatus = () => {
    if (!orderStatus) return null;

    let statusText = '';
    let statusClass = '';

    switch (orderStatus) {
      case 'pending':
        statusText = 'Đang chờ xử lý';
        statusClass = 'status-pending';
        break;
      case 'preparing':
        statusText = 'Đang chuẩn bị';
        statusClass = 'status-preparing';
        break;
      case 'ready':
        statusText = 'Sẵn sàng phục vụ';
        statusClass = 'status-ready';
        break;
      case 'delivered':
        statusText = 'Đã phục vụ';
        statusClass = 'status-delivered';
        break;
      case 'cancelled':
        statusText = 'Đã hủy';
        statusClass = 'status-cancelled';
        break;
      default:
        statusText = 'Không xác định';
        statusClass = '';
    }

    return (
      <div className={`order-status ${statusClass}`}>
        <h3>Trạng thái đơn hàng</h3>
        <p className="status-text">{statusText}</p>
        {orderStatus === 'preparing' && (
          <p className="estimated-time">
            Thời gian dự kiến: {getActiveOrderForTable(tableId!)?.estimatedTime || '10-15'} phút
          </p>
        )}

        <button className="new-order-btn" onClick={handleNewOrder}>
          Đặt món mới
        </button>
      </div>
    );
  };

  if (!tableId) {
    return (
      <div className="error-page">
        <div className="container">
          <h1>Lỗi: Không tìm thấy mã bàn</h1>
          <p>Vui lòng quét mã QR hợp lệ để đặt món.</p>
          <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-ordering-page">
      <div className="qr-header">
        <div className="container">
          <img src="https://ext.same-assets.com/0/1160240166.svg" alt="Gogi House" className="logo" />
          <h1>Đặt món trực tiếp</h1>
          <p>Bàn số: {tableId}</p>
        </div>
      </div>

      <div className="qr-content">
        <div className="container">
          {orderPlaced ? (
            <div className="order-placed-container">
              {renderOrderStatus()}

              <div className="order-details">
                <h3>Chi tiết đơn hàng</h3>
                <div className="order-items">
                  {cart.map(item => (
                    <div key={item.id} className="order-item">
                      <div className="item-name-quantity">
                        <span className="quantity">{item.quantity}x</span>
                        <span className="name">{item.name}</span>
                      </div>
                      <span className="price">{(item.price * item.quantity).toLocaleString()}đ</span>
                    </div>
                  ))}
                </div>
                {note && (
                  <div className="order-note-display">
                    <h4>Ghi chú:</h4>
                    <p>{note}</p>
                  </div>
                )}
                <div className="order-total">
                  <span>Tổng tiền:</span>
                  <span>{calculateTotal().toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="qr-ordering-layout">
              <div className={`menu-section ${showCartSection ? 'menu-collapsed' : ''}`}>
                {!showCartSection && (
                  <div className="ordering-instructions">
                    <h3>Hướng dẫn đặt món</h3>
                    <p>Chọn món ăn từ thực đơn bên dưới để thêm vào giỏ hàng. Khi hoàn tất, nhấn "Đặt món ngay" để gửi đơn hàng đến nhà bếp.</p>
                  </div>
                )}

                <div className="category-tabs">
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`category-tab ${selectedCategory === category ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category === 'popular' ? 'Món phổ biến' : category}
                    </button>
                  ))}
                </div>

                <div className="menu-items">
                  {displayedItems.map(item => (
                    <div
                      key={item.id}
                      className={`menu-item ${showAddedAnimation === item.id ? 'item-added' : ''}`}
                      onClick={() => addToCart(item)}
                    >
                      {item.image && (
                        <div className="item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                      )}
                      <div className="item-details">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">{item.description}</p>
                        <p className="item-price">{item.price.toLocaleString()}đ</p>
                        <button className="add-to-cart-btn">Thêm vào giỏ</button>
                        {item.popular && selectedCategory !== 'popular' && (
                          <span className="popular-badge">Phổ biến</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`cart-section ${showCartSection ? 'cart-expanded' : ''}`}
                ref={cartSectionRef}
              >
                <div className="cart-container">
                  <h2>Giỏ hàng của bạn</h2>

                  {cart.length === 0 ? (
                    <div className="empty-cart">
                      <p>Giỏ hàng của bạn đang trống</p>
                      <p>Vui lòng chọn món ăn từ thực đơn</p>
                    </div>
                  ) : (
                    <div className="cart-items">
                      {cart.map(item => (
                        <div key={item.id} className="cart-item">
                          <div className="item-info">
                            <h3>{item.name}</h3>
                            <p className="item-price">{item.price.toLocaleString()}đ</p>
                          </div>
                          <div className="item-actions">
                            <button onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); }}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={(e) => { e.stopPropagation(); addToCart(item); }}>+</button>
                          </div>
                          <div className="item-total">
                            {(item.price * item.quantity).toLocaleString()}đ
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="order-note">
                    <label htmlFor="note">Ghi chú đặc biệt:</label>
                    <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ghi chú về món ăn (không cay, ít muối, ...)"
                    />
                  </div>

                  <div className="cart-total">
                    <div className="total-row">
                      <span>Tổng tiền:</span>
                      <span>{calculateTotal().toLocaleString()}đ</span>
                    </div>
                  </div>

                  {!isAuthenticated && cart.length > 0 && (
                    <div className="auth-prompt">
                      <p>Đăng nhập để lưu đơn hàng vào lịch sử</p>
                      <button className="login-btn" onClick={handleLogin}>
                        Đăng nhập
                      </button>
                    </div>
                  )}

                  <button
                    className="order-button"
                    onClick={handleOrder}
                    disabled={cart.length === 0}
                  >
                    Đặt món ngay
                  </button>

                  {showCartSection && (
                    <button
                      className="back-to-menu-btn"
                      onClick={toggleCartSection}
                    >
                      Quay lại thực đơn
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating cart button */}
      {!orderPlaced && !showCartSection && (
        <FloatingCart
          itemCount={getCartItemCount()}
          onCartClick={toggleCartSection}
        />
      )}
    </div>
  );
};

export default QrOrdering;
