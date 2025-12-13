-- Create Database
CREATE DATABASE IF NOT EXISTS health_planner;
USE health_planner;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Health Data Table
CREATE TABLE IF NOT EXISTS health_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    age INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    height DECIMAL(5,2) NOT NULL,
    gender ENUM('male', 'female', 'other') NOT NULL,
    disease VARCHAR(50) NOT NULL,
    bmi DECIMAL(4,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Diet Plans Table
CREATE TABLE IF NOT EXISTS diet_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Sample Data (Optional for testing)
-- You can uncomment these lines to add test data

-- INSERT INTO users (name, email, password) VALUES 
-- ('John Doe', 'john@example.com', '$2y$10$YourHashedPasswordHere'),
-- ('Jane Smith', 'jane@example.com', '$2y$10$YourHashedPasswordHere');

-- INSERT INTO health_data (user_id, age, weight, height, gender, disease, bmi) VALUES
-- (1, 30, 75.5, 175.0, 'male', 'none', 24.65),
-- (2, 28, 65.0, 165.0, 'female', 'diabetes', 23.88);

-- Note: Password in the example would be 'password123' hashed with bcrypt
-- To generate a bcrypt hash in PHP: password_hash('password123', PASSWORD_DEFAULT)