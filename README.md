# 🚌 Hệ Thống Quản Lý Bán Vé Xe Khách

Dự án web app quản lý bán vé xe khách với 3 vai trò: **Khách Vãng Lai**, **Khách Hàng**, **Nhân Viên**, **Người Quản Trị**.

---

## 📁 Cấu Trúc Dự Án

```
bus-ticket-system/
├── backend/                    # Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # Kết nối database
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── ticketController.js
│   │   │   ├── routeController.js
│   │   │   ├── tripController.js
│   │   │   ├── vehicleController.js
│   │   │   ├── invoiceController.js
│   │   │   └── statsController.js
│   │   ├── middlewares/
│   │   │   ├── auth.js         # JWT middleware
│   │   │   └── role.js         # Phân quyền theo role
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Ticket.js
│   │   │   ├── Route.js
│   │   │   ├── Trip.js
│   │   │   ├── Vehicle.js
│   │   │   └── Invoice.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── ticket.routes.js
│   │   │   ├── route.routes.js
│   │   │   ├── trip.routes.js
│   │   │   ├── vehicle.routes.js
│   │   │   ├── invoice.routes.js
│   │   │   └── stats.routes.js
│   │   └── app.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/                   # React.js
    ├── public/
    ├── src/
    │   ├── api/                # Axios instances & API calls
    │   │   ├── axiosInstance.js
    │   │   ├── authApi.js
    │   │   ├── ticketApi.js
    │   │   ├── tripApi.js
    │   │   └── ...
    │   ├── components/
    │   │   ├── common/         # Navbar, Footer, Modal...
    │   │   └── ui/             # Button, Input, Table...
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── customer/
    │   │   │   ├── SearchTrip.jsx
    │   │   │   ├── BookTicket.jsx
    │   │   │   ├── CancelTicket.jsx
    │   │   │   ├── InvoiceHistory.jsx
    │   │   │   └── Profile.jsx
    │   │   ├── staff/
    │   │   │   ├── ManageInvoice.jsx
    │   │   │   └── Statistics.jsx
    │   │   └── admin/
    │   │       ├── ManageUsers.jsx
    │   │       ├── ManageRoutes.jsx
    │   │       ├── ManageTrips.jsx
    │   │       └── ManageVehicles.jsx
    │   ├── store/              # Redux Toolkit hoặc Context API
    │   │   ├── authSlice.js
    │   │   └── store.js
    │   ├── router/
    │   │   ├── AppRouter.jsx
    │   │   └── PrivateRoute.jsx
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    └── package.json
```

---

## 🗄️ Database (MySQL)

Chạy lần lượt các lệnh SQL sau:

```sql
CREATE DATABASE bus_ticket_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bus_ticket_db;

-- =============================================
-- BẢNG NGƯỜI DÙNG
-- =============================================
CREATE TABLE users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    full_name   VARCHAR(100)        NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    phone       VARCHAR(15),
    password    VARCHAR(255)        NOT NULL,
    role        ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
    is_active   BOOLEAN             DEFAULT TRUE,
    created_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- BẢNG TUYẾN XE
-- =============================================
CREATE TABLE routes (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    origin          VARCHAR(100) NOT NULL,
    destination     VARCHAR(100) NOT NULL,
    distance_km     FLOAT,
    duration_min    INT,
    base_price      DECIMAL(10, 2) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- BẢNG XE
-- =============================================
CREATE TABLE vehicles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    license_plate   VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type    VARCHAR(50),        -- e.g. "Giường nằm", "Limousine"
    total_seats     INT NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- BẢNG CHUYẾN XE
-- =============================================
CREATE TABLE trips (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    route_id        INT NOT NULL,
    vehicle_id      INT NOT NULL,
    departure_time  DATETIME NOT NULL,
    arrival_time    DATETIME,
    available_seats INT NOT NULL,
    price           DECIMAL(10, 2) NOT NULL,
    status          ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id)   REFERENCES routes(id)   ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);

-- =============================================
-- BẢNG HÓA ĐƠN / ĐẶT VÉ
-- =============================================
CREATE TABLE invoices (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    trip_id         INT NOT NULL,
    seat_number     INT NOT NULL,
    total_price     DECIMAL(10, 2) NOT NULL,
    payment_method  ENUM('cash', 'banking', 'momo') DEFAULT 'cash',
    payment_status  ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    booking_status  ENUM('booked', 'cancelled') DEFAULT 'booked',
    cancelled_at    TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- =============================================
-- INDEX GỢI Ý (TỐI ƯU QUERY)
-- =============================================
CREATE INDEX idx_trips_route     ON trips(route_id);
CREATE INDEX idx_trips_departure ON trips(departure_time);
CREATE INDEX idx_invoices_user   ON invoices(user_id);
CREATE INDEX idx_invoices_trip   ON invoices(trip_id);
```

---

## ⚙️ Backend (Node.js + Express)

### Cài đặt

```bash
cd backend
npm install express mysql2 sequelize dotenv bcryptjs jsonwebtoken cors morgan
npm install --save-dev nodemon
```

### `.env`

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bus_ticket_db
DB_USER=root
DB_PASS=yourpassword
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### API Endpoints

| Method | Endpoint | Mô tả | Role |
|--------|----------|-------|------|
| POST | `/api/auth/register` | Đăng ký tài khoản | Public |
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/logout` | Đăng xuất | Auth |
| GET | `/api/auth/profile` | Xem thông tin cá nhân | Auth |
| PUT | `/api/auth/profile` | Cập nhật thông tin cá nhân | Auth |
| PUT | `/api/auth/change-password` | Đổi mật khẩu | Auth |
| GET | `/api/trips/search` | Tìm kiếm chuyến xe | Public |
| GET | `/api/trips/:id` | Xem lịch trình chuyến xe | Public |
| POST | `/api/invoices` | Đặt vé | Customer |
| DELETE | `/api/invoices/:id` | Hủy đơn đặt vé | Customer |
| GET | `/api/invoices/my` | Xem lịch sử hóa đơn | Customer |
| GET | `/api/users` | Xem danh sách người dùng | Admin |
| POST | `/api/users` | Thêm tài khoản | Admin |
| DELETE | `/api/users/:id` | Xóa người dùng | Admin |
| PUT | `/api/users/:id/role` | Phân quyền | Admin |
| GET | `/api/routes` | Danh sách tuyến xe | Staff/Admin |
| POST | `/api/routes` | Thêm tuyến xe | Admin |
| PUT | `/api/routes/:id` | Sửa tuyến xe | Admin |
| DELETE | `/api/routes/:id` | Xóa tuyến xe | Admin |
| GET | `/api/trips` | Danh sách chuyến xe | Staff/Admin |
| POST | `/api/trips` | Thêm chuyến xe | Admin |
| PUT | `/api/trips/:id` | Sửa chuyến xe | Admin |
| DELETE | `/api/trips/:id` | Xóa chuyến xe | Admin |
| GET | `/api/vehicles` | Danh sách xe | Staff/Admin |
| POST | `/api/vehicles` | Thêm xe | Admin |
| PUT | `/api/vehicles/:id` | Sửa xe | Admin |
| DELETE | `/api/vehicles/:id` | Xóa xe | Admin |
| GET | `/api/invoices` | Quản lý hóa đơn | Staff/Admin |
| GET | `/api/stats` | Thống kê | Staff/Admin |

---

## 🖥️ Frontend (React.js + Vite)

### Cài đặt

```bash
cd frontend
npm create vite@latest . -- --template react
npm install axios react-router-dom redux @reduxjs/toolkit react-redux
npm install tailwindcss @tailwindcss/vite
```

### `.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### Phân quyền theo Role

| Trang | Khách Vãng Lai | Khách Hàng | Nhân Viên | Quản Trị |
|-------|:-:|:-:|:-:|:-:|
| Tìm kiếm chuyến xe | ✅ | ✅ | ✅ | ✅ |
| Đăng ký / Đăng nhập | ✅ | ✅ | ✅ | ✅ |
| Đặt vé | ❌ | ✅ | ❌ | ❌ |
| Hủy đơn đặt vé | ❌ | ✅ | ❌ | ❌ |
| Xem lịch sử hóa đơn | ❌ | ✅ | ❌ | ❌ |
| Cập nhật thông tin cá nhân | ❌ | ✅ | ✅ | ✅ |
| Quản lý hóa đơn | ❌ | ❌ | ✅ | ✅ |
| Thống kê | ❌ | ❌ | ✅ | ✅ |
| Quản lý tuyến xe / chuyến xe / xe | ❌ | ❌ | ❌ | ✅ |
| Quản lý người dùng | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Chạy Dự Án

```bash
# Backend
cd backend
npm run dev       # nodemon server.js

# Frontend
cd frontend
npm run dev       # Vite dev server
```

- Backend: http://localhost:5000  
- Frontend: http://localhost:5173

---

## 🛠️ Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Backend | Node.js, Express.js |
| Frontend | React.js (Vite) |
| Database | MySQL + Sequelize ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Tailwind CSS |
| State | Redux Toolkit |
| HTTP Client | Axios |

---

## 📌 Ghi Chú

- Tất cả API cần xác thực phải gửi kèm header: `Authorization: Bearer <token>`
- Mật khẩu được hash bằng `bcryptjs` trước khi lưu vào DB
- `role` trong JWT payload dùng để phân quyền middleware phía backend và PrivateRoute phía frontend
