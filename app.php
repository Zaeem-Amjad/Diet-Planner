<?php
// Start session
session_start();

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'health_planner';

// Create database connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed']));
}

// Set charset
$conn->set_charset('utf8mb4');

// Get action from POST
$action = isset($_POST['action']) ? $_POST['action'] : '';

// Handle different actions
switch ($action) {
    case 'signup':
        handleSignup($conn);
        break;
    case 'login':
        handleLogin($conn);
        break;
    case 'save-health':
        handleSaveHealth($conn);
        break;
    case 'save-diet':
        handleSaveDiet($conn);
        break;
    case 'get-dashboard':
        handleGetDashboard($conn);
        break;
    case 'check-session':
        handleCheckSession();
        break;
    case 'logout':
        handleLogout();
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Invalid action']);
}

$conn->close();

// Signup Handler
function handleSignup($conn) {
    $name = sanitizeInput($_POST['name']);
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password'];
    
    // Validate inputs
    if (empty($name) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        return;
    }
    
    // Check if email already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already registered']);
        $stmt->close();
        return;
    }
    $stmt->close();
    
    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("sss", $name, $email, $hashed_password);
    
    if ($stmt->execute()) {
        $user_id = $conn->insert_id;
        
        // Set session
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_name'] = $name;
        $_SESSION['user_email'] = $email;
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user_id,
                'name' => $name,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create account']);
    }
    
    $stmt->close();
}

// Login Handler
function handleLogin($conn) {
    $email = sanitizeInput($_POST['email']);
    $password = $_POST['password'];
    
    // Validate inputs
    if (empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        return;
    }
    
    // Get user from database
    $stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        $stmt->close();
        return;
    }
    
    $user = $result->fetch_assoc();
    $stmt->close();
    
    // Verify password
    if (password_verify($password, $user['password'])) {
        // Set session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        
        // Check if user has health data
        $stmt = $conn->prepare("SELECT id FROM health_data WHERE user_id = ?");
        $stmt->bind_param("i", $user['id']);
        $stmt->execute();
        $health_result = $stmt->get_result();
        $hasHealthData = $health_result->num_rows > 0;
        $stmt->close();
        
        echo json_encode([
            'success' => true,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ],
            'hasHealthData' => $hasHealthData
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    }
}

// Save Health Data Handler
function handleSaveHealth($conn) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        return;
    }
    
    $user_id = $_SESSION['user_id'];
    $age = intval($_POST['age']);
    $weight = floatval($_POST['weight']);
    $height = floatval($_POST['height']);
    $gender = sanitizeInput($_POST['gender']);
    $disease = sanitizeInput($_POST['disease']);
    
    // Calculate BMI
    $height_m = $height / 100;
    $bmi = round($weight / ($height_m * $height_m), 2);
    
    // Check if health data exists
    $stmt = $conn->prepare("SELECT id FROM health_data WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    if ($result->num_rows > 0) {
        // Update existing data
        $stmt = $conn->prepare("UPDATE health_data SET age = ?, weight = ?, height = ?, gender = ?, disease = ?, bmi = ?, updated_at = NOW() WHERE user_id = ?");
        $stmt->bind_param("iddssdi", $age, $weight, $height, $gender, $disease, $bmi, $user_id);
    } else {
        // Insert new data
        $stmt = $conn->prepare("INSERT INTO health_data (user_id, age, weight, height, gender, disease, bmi, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->bind_param("iidsssd", $user_id, $age, $weight, $height, $gender, $disease, $bmi);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save health data']);
    }
    
    $stmt->close();
}

// Save Diet Plan Handler
function handleSaveDiet($conn) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        return;
    }
    
    $user_id = $_SESSION['user_id'];
    $diet_plan = $_POST['dietPlan'];
    
    // Check if diet plan exists
    $stmt = $conn->prepare("SELECT id FROM diet_plans WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $stmt->close();
    
    if ($result->num_rows > 0) {
        // Update existing plan
        $stmt = $conn->prepare("UPDATE diet_plans SET plan_data = ?, updated_at = NOW() WHERE user_id = ?");
        $stmt->bind_param("si", $diet_plan, $user_id);
    } else {
        // Insert new plan
        $stmt = $conn->prepare("INSERT INTO diet_plans (user_id, plan_data, created_at) VALUES (?, ?, NOW())");
        $stmt->bind_param("is", $user_id, $diet_plan);
    }
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save diet plan']);
    }
    
    $stmt->close();
}

// Get Dashboard Data Handler
function handleGetDashboard($conn) {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'message' => 'Not logged in']);
        return;
    }
    
    $user_id = $_SESSION['user_id'];
    
    // Get health data
    $stmt = $conn->prepare("SELECT age, weight, height, gender, disease, bmi FROM health_data WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'No health data found']);
        $stmt->close();
        return;
    }
    
    $health_data = $result->fetch_assoc();
    $stmt->close();
    
    // Get diet plan
    $stmt = $conn->prepare("SELECT plan_data FROM diet_plans WHERE user_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'No diet plan found']);
        $stmt->close();
        return;
    }
    
    $diet_plan = $result->fetch_assoc()['plan_data'];
    $stmt->close();
    
    echo json_encode([
        'success' => true,
        'healthData' => $health_data,
        'dietPlan' => $diet_plan
    ]);
}

// Check Session Handler
function handleCheckSession() {
    if (isset($_SESSION['user_id'])) {
        echo json_encode([
            'isLoggedIn' => true,
            'user' => [
                'id' => $_SESSION['user_id'],
                'name' => $_SESSION['user_name'],
                'email' => $_SESSION['user_email']
            ]
        ]);
    } else {
        echo json_encode(['isLoggedIn' => false]);
    }
}

// Logout Handler
function handleLogout() {
    session_destroy();
    echo json_encode(['success' => true]);
}

// Sanitize Input
function sanitizeInput($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}
?>