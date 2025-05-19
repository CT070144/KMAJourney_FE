-- Create database
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

-- Create tables
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image VARCHAR(255),
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sub_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    sale_price DECIMAL(10,2),
    stock_quantity INT NOT NULL DEFAULT 0,
    category_id INT,
    sub_category_id INT,
    brand_id INT,
    featured BOOLEAN DEFAULT false,
    is_best_seller BOOLEAN DEFAULT false,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (sub_category_id) REFERENCES sub_categories(id),
    FOREIGN KEY (brand_id) REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    phone_number VARCHAR(20),
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cart_id INT,
    product_id INT,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    user_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS home_banner_slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create statistics table
CREATE TABLE IF NOT EXISTS statistics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total_users INT DEFAULT 0,
    total_products INT DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_reviews INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    total_categories INT DEFAULT 0,
    total_sub_categories INT DEFAULT 0,
    total_brands INT DEFAULT 0,
    total_banners INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial statistics record
INSERT INTO statistics (total_users, total_products, total_orders, total_reviews, total_revenue, total_categories, total_sub_categories, total_brands, total_banners)
VALUES (0, 0, 0, 0, 0.00, 0, 0, 0, 0);

-- Triggers for users
DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_users = total_users + 1;
END//
CREATE TRIGGER after_user_delete
AFTER DELETE ON users
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_users = total_users - 1;
END//
DELIMITER ;

-- Triggers for products
DELIMITER //
CREATE TRIGGER after_product_insert
AFTER INSERT ON products
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_products = total_products + 1;
END//
CREATE TRIGGER after_product_delete
AFTER DELETE ON products
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_products = total_products - 1;
END//
DELIMITER ;

-- Triggers for orders
DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    UPDATE statistics 
    SET total_orders = total_orders + 1,
        total_revenue = total_revenue + NEW.total_amount;
END//
CREATE TRIGGER after_order_delete
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    UPDATE statistics 
    SET total_orders = total_orders - 1,
        total_revenue = total_revenue - OLD.total_amount;
END//
DELIMITER ;

-- Triggers for reviews
DELIMITER //
CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_reviews = total_reviews + 1;
END//
CREATE TRIGGER after_review_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_reviews = total_reviews - 1;
END//
DELIMITER ;

-- Triggers for categories
DELIMITER //
CREATE TRIGGER after_category_insert
AFTER INSERT ON categories
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_categories = total_categories + 1;
END//
CREATE TRIGGER after_category_delete
AFTER DELETE ON categories
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_categories = total_categories - 1;
END//
DELIMITER ;

-- Triggers for sub_categories
DELIMITER //
CREATE TRIGGER after_sub_category_insert
AFTER INSERT ON sub_categories
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_sub_categories = total_sub_categories + 1;
END//
CREATE TRIGGER after_sub_category_delete
AFTER DELETE ON sub_categories
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_sub_categories = total_sub_categories - 1;
END//
DELIMITER ;

-- Triggers for brands
DELIMITER //
CREATE TRIGGER after_brand_insert
AFTER INSERT ON brands
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_brands = total_brands + 1;
END//
CREATE TRIGGER after_brand_delete
AFTER DELETE ON brands
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_brands = total_brands - 1;
END//
DELIMITER ;

-- Triggers for home_banner_slides
DELIMITER //
CREATE TRIGGER after_banner_insert
AFTER INSERT ON home_banner_slides
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_banners = total_banners + 1;
END//
CREATE TRIGGER after_banner_delete
AFTER DELETE ON home_banner_slides
FOR EACH ROW
BEGIN
    UPDATE statistics SET total_banners = total_banners - 1;
END//
DELIMITER ;

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_sub_category ON products(sub_category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- Insert sample admin user
INSERT INTO users (email, password, first_name, last_name, role)
VALUES ('admin@example.com', '$2a$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', 'Admin', 'User', 'admin');

-- Insert sample categories
INSERT INTO categories (name, slug, description, image, color) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories', 'electronics.png', '#e3f4ff'),
('Clothing', 'clothing', 'Fashion and apparel', 'clothing.png', '#fff3ff'),
('Books', 'books', 'Books and publications', 'books.png', '#e3fffa');

-- Insert sample brands
INSERT INTO brands (name, slug) VALUES
('Lay''s', 'lays'),
('Aadi', 'aadi'),
('Olay', 'olay');

-- Insert sample sub categories
INSERT INTO sub_categories (name, slug, category_id) VALUES
('Men Bags', 'men-bags', 1),
('Men Footwear', 'men-footwear', 2),
('Women Bags', 'women-bags', 1),
('Women Footwear', 'women-footwear', 2);

-- Insert sample products
INSERT INTO products (name, slug, description, price, stock_quantity, category_id, sub_category_id, brand_id, is_best_seller) VALUES
('Lays', 'lays', 'Lorem Ipsum is simply dummy text', 20.00, 100, 1, 1, 1, TRUE),
('Aadi Men''s White Shoes', 'aadi-mens-white-shoes', 'Lorem Ipsum is simply dummy text', 398.00, 50, 2, 2, 2, TRUE),
('Olay Total Effect 7', 'olay-total-effect-7', 'Lorem Ipsum is simply dummy text', 1200.00, 30, 1, 3, 3, TRUE);

-- Insert sample home banners
INSERT INTO home_banner_slides (image) VALUES
('banner1.png'),
('banner2.png'),
('banner3.png'); 