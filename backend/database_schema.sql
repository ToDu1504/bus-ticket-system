-- Bus Ticket Management System Database Schema (MySQL)

-- Create users table
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `phone` VARCHAR(15),
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'staff', 'admin') DEFAULT 'customer',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create routes table
CREATE TABLE IF NOT EXISTS `routes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `origin` VARCHAR(100) NOT NULL,
  `destination` VARCHAR(100) NOT NULL,
  `distance_km` FLOAT,
  `duration_min` INT,
  `base_price` DECIMAL(10, 2) NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create vehicles table
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `license_plate` VARCHAR(20) NOT NULL UNIQUE,
  `vehicle_type` VARCHAR(50),
  `total_seats` INT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create trips table
CREATE TABLE IF NOT EXISTS `trips` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `route_id` INT NOT NULL,
  `vehicle_id` INT NOT NULL,
  `departure_time` DATETIME NOT NULL,
  `arrival_time` DATETIME,
  `available_seats` INT NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `status` ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_trip_route` FOREIGN KEY (`route_id`) REFERENCES `routes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_trip_vehicle` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create invoices (bookings) table
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `trip_id` INT NOT NULL,
  `seat_number` INT NOT NULL,
  `total_price` DECIMAL(10, 2) NOT NULL,
  `payment_method` ENUM('cash', 'banking', 'momo') DEFAULT 'cash',
  `payment_status` ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
  `booking_status` ENUM('pending', 'booked', 'cancelled') DEFAULT 'pending',
  `cancelled_at` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_invoice_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_invoice_trip` FOREIGN KEY (`trip_id`) REFERENCES `trips` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
