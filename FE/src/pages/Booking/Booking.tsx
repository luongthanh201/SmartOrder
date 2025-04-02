import { useState } from 'react';
import './Booking.scss';

const Booking = () => {
  const [formData, setFormData] = useState({
    location: 'Hà Nội',
    restaurant: '',
    date: '',
    time: '',
    guests: '',
    name: '',
    phone: '',
    email: '',
    notes: '',
    withChildren: false,
    birthday: false,
    window: false,
    childrenChair: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking data:', formData);
    alert('Đặt bàn thành công!');
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <div className="container">
          <h1>Đặt Bàn dễ dàng tại chuỗi nhà hàng Golden Gate</h1>
          <p>Đặt bàn trực tuyến tại 500+ nhà hàng toàn quốc. Đảm bảo chất lượng dịch vụ, món ngon và địa điểm ưng ý cho mọi thực khách.</p>
        </div>
      </div>

      <div className="booking-content">
        <div className="container">
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>Thông tin đặt bàn</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="location">Chọn địa điểm</label>
                  <select
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="restaurant">Chọn nhà hàng</label>
                  <select
                    id="restaurant"
                    name="restaurant"
                    value={formData.restaurant}
                    onChange={handleChange}
                    required
                  >
                    <option value="">-- Chọn nhà hàng --</option>
                    <option value="Gogi Trích Sài">Gogi Trích Sài</option>
                    <option value="Gogi Hoàng Quốc Việt">Gogi Hoàng Quốc Việt</option>
                    <option value="Gogi Royal City">Gogi Royal City</option>
                    <option value="Gogi Nguyễn Chí Thanh">Gogi Nguyễn Chí Thanh</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Ngày đặt bàn</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Giờ đặt bàn</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Số lượng khách</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2>Thông tin liên hệ</h2>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Họ tên</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Số điện thoại</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Ghi chú</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="checkboxes">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="withChildren"
                    name="withChildren"
                    checked={formData.withChildren}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="withChildren">Có trẻ em</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="birthday"
                    name="birthday"
                    checked={formData.birthday}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="birthday">Tiệc sinh nhật</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="window"
                    name="window"
                    checked={formData.window}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="window">Bàn gần cửa sổ</label>
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="childrenChair"
                    name="childrenChair"
                    checked={formData.childrenChair}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="childrenChair">Cần ghế trẻ em</label>
                </div>
              </div>

              <div className="form-policy">
                <p>Bạn đã xác nhận đọc và đồng ý với các chính sách bảo mật của datban.ggg.com.vn</p>
              </div>

              <button type="submit" className="booking-submit-btn">
                Đặt bàn ngay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
