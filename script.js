// Global State
let currentSection = 'home';
let userData = {
    isLoggedIn: false,
    name: '',
    email: '',
    healthData: null,
    dietPlan: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeCustomCursor();
    initializeParticles();
    initializeThemeToggle();
    initializeFormHandlers();
    checkSession();
});

// Initialize Application
function initializeApp() {
    // Show home section by default
    navigateToSection('home');
    
    // Add scroll animations
    window.addEventListener('scroll', handleScrollAnimations);
}

// Custom Cursor
function initializeCustomCursor() {
    const cursorDot = document.getElementById('cursorDot');
    const cursorOutline = document.getElementById('cursorOutline');
    
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
            
            setTimeout(() => {
                cursorOutline.style.left = e.clientX - 15 + 'px';
                cursorOutline.style.top = e.clientY - 15 + 'px';
            }, 50);
        });
        
        // Cursor effects on hover
        const interactiveElements = document.querySelectorAll('a, button, .feature-card, .auth-card, input, select');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.width = '50px';
                cursorOutline.style.height = '50px';
                cursorOutline.style.left = (parseInt(cursorOutline.style.left) - 10) + 'px';
                cursorOutline.style.top = (parseInt(cursorOutline.style.top) - 10) + 'px';
            });
            
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.width = '30px';
                cursorOutline.style.height = '30px';
            });
        });
    }
}

// Particle System
function initializeParticles() {
    const particleContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 5 + 2 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = 'var(--primary-color)';
    particle.style.borderRadius = '50%';
    particle.style.opacity = Math.random() * 0.5;
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    
    particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    
    container.appendChild(particle);
}

// Theme Toggle
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    document.body.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
        const theme = document.body.getAttribute('data-theme');
        const newTheme = theme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add rotation animation
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}

// Navigation between sections
function navigateToSection(sectionId) {
    const currentSectionEl = document.querySelector('.section.active');
    const nextSectionEl = document.getElementById(sectionId);
    
    if (!nextSectionEl) return;
    
    // Hide current section
    if (currentSectionEl) {
        currentSectionEl.classList.remove('active');
        currentSectionEl.style.opacity = '0';
        currentSectionEl.style.transform = 'translateY(-30px)';
    }
    
    // Show next section after delay
    setTimeout(() => {
        if (currentSectionEl) {
            currentSectionEl.style.display = 'none';
        }
        
        nextSectionEl.style.display = 'block';
        nextSectionEl.style.opacity = '0';
        nextSectionEl.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            nextSectionEl.classList.add('active');
        }, 50);
    }, 300);
    
    currentSection = sectionId;
    window.scrollTo(0, 0);
}

// Form Handlers
function initializeFormHandlers() {
    // Signup Form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Health Form
    const healthForm = document.getElementById('healthForm');
    if (healthForm) {
        healthForm.addEventListener('submit', handleHealthSubmit);
    }
}

// Handle Signup
function handleSignup(e) {
    e.preventDefault();
    showLoading();
    
    const formData = new FormData(e.target);
    
    fetch('app.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            userData.isLoggedIn = true;
            userData.name = data.user.name;
            userData.email = data.user.email;
            
            alert('Account created successfully!');
            navigateToSection('health-info');
        } else {
            alert(data.message || 'Signup failed. Please try again.');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    showLoading();
    
    const formData = new FormData(e.target);
    
    fetch('app.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            userData.isLoggedIn = true;
            userData.name = data.user.name;
            userData.email = data.user.email;
            
            // Check if user has health data
            if (data.hasHealthData) {
                loadUserDashboard();
            } else {
                navigateToSection('health-info');
            }
        } else {
            alert(data.message || 'Login failed. Please check your credentials.');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
}

// Handle Health Information Submit
function handleHealthSubmit(e) {
    e.preventDefault();
    showLoading();
    
    const formData = new FormData(e.target);
    
    // Store health data
    userData.healthData = {
        age: formData.get('age'),
        weight: formData.get('weight'),
        height: formData.get('height'),
        gender: formData.get('gender'),
        disease: formData.get('disease')
    };
    
    // If logged in, save to database
    if (userData.isLoggedIn) {
        fetch('app.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                generateDietPlan();
            } else {
                hideLoading();
                alert('Failed to save health data');
            }
        })
        .catch(error => {
            hideLoading();
            console.error('Error:', error);
        });
    } else {
        // Guest user - just generate plan
        generateDietPlan();
    }
}

// Generate Diet Plan
function generateDietPlan() {
    const healthData = userData.healthData;
    const disease = healthData.disease;
    
    // Calculate BMI
    const heightM = healthData.height / 100;
    const bmi = (healthData.weight / (heightM * heightM)).toFixed(1);
    
    // Generate diet plan based on disease
    const dietPlans = {
        'none': generateNormalDietPlan(),
        'diabetes': generateDiabeticDietPlan(),
        'blood-pressure': generateBPDietPlan(),
        'heart-disease': generateHeartDietPlan(),
        'obesity': generateWeightLossDietPlan(),
        'thyroid': generateThyroidDietPlan()
    };
    
    userData.dietPlan = dietPlans[disease] || dietPlans['none'];
    
    // Save diet plan if logged in
    if (userData.isLoggedIn) {
        saveDietPlan();
    } else {
        hideLoading();
        displayDashboard();
    }
}

// Diet Plan Generators
function generateNormalDietPlan() {
    return {
        days: [
            {
                day: 'Monday',
                breakfast: 'Oatmeal with fruits and nuts, Green tea',
                lunch: 'Grilled chicken with quinoa and steamed vegetables',
                dinner: 'Baked salmon with brown rice and salad',
                snacks: 'Mixed nuts, Fresh fruit'
            },
            {
                day: 'Tuesday',
                breakfast: 'Whole grain toast with avocado and eggs',
                lunch: 'Turkey sandwich with whole grain bread and vegetables',
                dinner: 'Stir-fried tofu with vegetables and brown rice',
                snacks: 'Greek yogurt, Carrot sticks'
            },
            {
                day: 'Wednesday',
                breakfast: 'Smoothie bowl with berries and granola',
                lunch: 'Lentil soup with whole grain bread',
                dinner: 'Grilled fish with sweet potato and broccoli',
                snacks: 'Hummus with cucumber, Apple'
            },
            {
                day: 'Thursday',
                breakfast: 'Greek yogurt with honey and nuts',
                lunch: 'Chicken Caesar salad with light dressing',
                dinner: 'Vegetable curry with brown rice',
                snacks: 'Protein bar, Orange'
            },
            {
                day: 'Friday',
                breakfast: 'Scrambled eggs with spinach and tomatoes',
                lunch: 'Quinoa bowl with roasted vegetables',
                dinner: 'Grilled chicken breast with roasted vegetables',
                snacks: 'Mixed berries, Almonds'
            },
            {
                day: 'Saturday',
                breakfast: 'Pancakes with fresh berries',
                lunch: 'Tuna salad with mixed greens',
                dinner: 'Baked chicken with sweet potato fries',
                snacks: 'Cottage cheese, Grapes'
            },
            {
                day: 'Sunday',
                breakfast: 'French toast with fruit compote',
                lunch: 'Vegetable pasta with olive oil',
                dinner: 'Lean beef with roasted vegetables',
                snacks: 'Trail mix, Banana'
            }
        ],
        exercise: 'Moderate cardio 30 minutes daily, Strength training 3x per week',
        water: '8-10 glasses (2-2.5 liters) daily',
        tips: [
            'Eat colorful fruits and vegetables',
            'Include lean proteins in every meal',
            'Choose whole grains over refined grains',
            'Stay hydrated throughout the day',
            'Practice portion control'
        ]
    };
}

function generateDiabeticDietPlan() {
    return {
        days: [
            {
                day: 'Monday',
                breakfast: 'Steel-cut oats with berries and cinnamon',
                lunch: 'Grilled chicken salad with olive oil dressing',
                dinner: 'Baked fish with cauliflower rice and green beans',
                snacks: 'Raw almonds, Cucumber slices'
            },
            {
                day: 'Tuesday',
                breakfast: 'Scrambled eggs with spinach and mushrooms',
                lunch: 'Turkey lettuce wraps with vegetables',
                dinner: 'Lean beef stir-fry with low-carb vegetables',
                snacks: 'Celery with almond butter, Cherry tomatoes'
            },
            {
                day: 'Wednesday',
                breakfast: 'Greek yogurt (unsweetened) with chia seeds',
                lunch: 'Lentil soup with side salad',
                dinner: 'Grilled salmon with asparagus and quinoa',
                snacks: 'Walnuts, Bell pepper strips'
            },
            {
                day: 'Thursday',
                breakfast: 'Vegetable omelet with avocado',
                lunch: 'Chicken breast with roasted vegetables',
                dinner: 'Baked cod with broccoli and brown rice',
                snacks: 'Hard-boiled egg, Small apple'
            },
            {
                day: 'Friday',
                breakfast: 'Protein smoothie with spinach and berries',
                lunch: 'Tuna salad over mixed greens',
                dinner: 'Turkey meatballs with zucchini noodles',
                snacks: 'String cheese, Carrots'
            },
            {
                day: 'Saturday',
                breakfast: 'Cottage cheese with cinnamon and nuts',
                lunch: 'Grilled chicken with cauliflower mash',
                dinner: 'Baked tilapia with green beans',
                snacks: 'Almonds, Cucumber'
            },
            {
                day: 'Sunday',
                breakfast: 'Egg white omelet with vegetables',
                lunch: 'Chicken soup with vegetables',
                dinner: 'Lean pork with Brussels sprouts',
                snacks: 'Pumpkin seeds, Celery'
            }
        ],
        exercise: 'Walk 30 minutes after meals, Light resistance training 3x week',
        water: '10-12 glasses (2.5-3 liters) daily',
        tips: [
            'Monitor blood sugar levels regularly',
            'Choose low glycemic index foods',
            'Eat at regular intervals',
            'Avoid sugary drinks and desserts',
            'Include fiber-rich foods in every meal'
        ]
    };
}

function generateBPDietPlan() {
    return {
        days: [
            {
                day: 'Monday',
                breakfast: 'Oatmeal with banana and flaxseeds',
                lunch: 'Grilled fish with steamed vegetables',
                dinner: 'Skinless chicken with brown rice and salad',
                snacks: 'Fresh berries, Unsalted nuts'
            },
            {
                day: 'Tuesday',
                breakfast: 'Whole grain toast with avocado',
                lunch: 'Bean salad with olive oil dressing',
                dinner: 'Baked salmon with sweet potato',
                snacks: 'Apple slices, Low-fat yogurt'
            },
            {
                day: 'Wednesday',
                breakfast: 'Greek yogurt with granola and berries',
                lunch: 'Vegetable soup with whole grain bread',
                dinner: 'Grilled chicken with quinoa and broccoli',
                snacks: 'Carrot sticks, Hummus'
            },
            {
                day: 'Thursday',
                breakfast: 'Smoothie with spinach, banana, and berries',
                lunch: 'Tuna sandwich on whole grain bread',
                dinner: 'Turkey breast with roasted vegetables',
                snacks: 'Orange, Almonds'
            },
            {
                day: 'Friday',
                breakfast: 'Scrambled eggs with tomatoes and herbs',
                lunch: 'Lentil curry with brown rice',
                dinner: 'Baked cod with green beans',
                snacks: 'Banana, Walnuts'
            },
            {
                day: 'Saturday',
                breakfast: 'Whole grain cereal with low-fat milk',
                lunch: 'Chicken salad with mixed greens',
                dinner: 'Vegetable stir-fry with tofu',
                snacks: 'Grapes, Cashews'
            },
            {
                day: 'Sunday',
                breakfast: 'Fruit salad with cottage cheese',
                lunch: 'Quinoa bowl with roasted vegetables',
                dinner: 'Grilled fish with asparagus',
                snacks: 'Pear, Pistachios'
            }
        ],
        exercise: 'Moderate aerobic exercise 30-45 minutes daily, Yoga 3x week',
        water: '8-10 glasses, limit caffeine',
        tips: [
            'Reduce sodium intake significantly',
            'Eat potassium-rich foods',
            'Limit processed foods',
            'Avoid alcohol and smoking',
            'Maintain healthy weight'
        ]
    };
}

function generateHeartDietPlan() {
    return {
        days: [
            {
                day: 'Monday',
                breakfast: 'Oatmeal with walnuts and blueberries',
                lunch: 'Salmon salad with olive oil',
                dinner: 'Grilled chicken with steamed vegetables',
                snacks: 'Almonds, Apple'
            },
            {
                day: 'Tuesday',
                breakfast: 'Whole grain toast with avocado',
                lunch: 'Lentil soup with vegetables',
                dinner: 'Baked fish with quinoa',
                snacks: 'Fresh berries, Walnuts'
            },
            {
                day: 'Wednesday',
                breakfast: 'Greek yogurt with chia seeds',
                lunch: 'Tuna salad with mixed greens',
                dinner: 'Turkey breast with brown rice',
                snacks: 'Carrot sticks, Hummus'
            },
            {
                day: 'Thursday',
                breakfast: 'Smoothie with flaxseeds and berries',
                lunch: 'Chickpea salad with vegetables',
                dinner: 'Grilled salmon with broccoli',
                snacks: 'Orange, Almonds'
            },
            {
                day: 'Friday',
                breakfast: 'Scrambled eggs with spinach',
                lunch: 'Vegetable soup with beans',
                dinner: 'Baked chicken with sweet potato',
                snacks: 'Pear, Walnuts'
            },
            {
                day: 'Saturday',
                breakfast: 'Oat bran cereal with berries',
                lunch: 'Quinoa bowl with vegetables',
                dinner: 'Grilled fish with asparagus',
                snacks: 'Grapes, Pistachios'
            },
            {
                day: 'Sunday',
                breakfast: 'Whole grain pancakes with fruit',
                lunch: 'Bean and vegetable salad',
                dinner: 'Lean turkey with roasted vegetables',
                snacks: 'Banana, Almonds'
            }
        ],
        exercise: 'Cardio 30-45 minutes 5x week, Gentle strength training',
        water: '8-10 glasses daily',
        tips: [
            'Choose heart-healthy fats',
            'Eat fatty fish twice a week',
            'Limit saturated and trans fats',
            'Increase fiber intake',
            'Control portion sizes'
        ]
    };
}

function generateWeightLossDietPlan() {
    return {
        days: [
            {
                day: 'Monday',
                breakfast: 'Protein smoothie with greens',
                lunch: 'Grilled chicken salad',
                dinner: 'Baked fish with vegetables',
                snacks: 'Cucumber, Boiled egg'
            },
            {
                day: 'Tuesday',
                breakfast: 'Egg white omelet with vegetables',
                lunch: 'Tuna with mixed greens',
                dinner: 'Turkey breast with broccoli',
                snacks: 'Celery, Greek yogurt'
            },
            {
                day: 'Wednesday',
                breakfast: 'Low-fat cottage cheese with berries',
                lunch: 'Chicken soup with vegetables',
                dinner: 'Grilled fish with zucchini',
                snacks: 'Cherry tomatoes, Almonds'
            },
            {
                day: 'Thursday',
                breakfast: 'Protein shake with spinach',
                lunch: 'Vegetable salad with grilled chicken',
                dinner: 'Baked salmon with asparagus',
                snacks: 'Carrot sticks, Hard-boiled egg'
            },
            {
                day: 'Friday',
                breakfast: 'Greek yogurt with chia seeds',
                lunch: 'Tuna salad lettuce wraps',
                dinner: 'Lean beef with green beans',
                snacks: 'Bell peppers, Cottage cheese'
            },
            {
                day: 'Saturday',
                breakfast: 'Vegetable omelet',
                lunch: 'Grilled chicken with cauliflower rice',
                dinner: 'Baked cod with Brussels sprouts',
                snacks: 'Cucumber, Almonds'
            },
            {
                day: 'Sunday',
                breakfast: 'Protein pancakes with berries',
                lunch: 'Chicken and vegetable stir-fry',
                dinner: 'Grilled fish with salad',
                snacks: 'Celery, Greek yogurt'
            }
        ],
        exercise: 'Cardio 45-60 minutes 5-6x week, Strength training 3x week',
        water: '10-12 glasses daily (helps metabolism)',
        tips: [
            'Create a calorie deficit',
            'Eat protein with every meal',
            'Avoid processed foods',
            'Practice mindful eating',
            'Get adequate sleep'
        ]
    };
}

function generateThyroidDietPlan() {
    return {
        days: [
            {
                day: 'Monday',
                breakfast: 'Scrambled eggs with mushrooms',
                lunch: 'Grilled chicken with quinoa',
                dinner: 'Baked salmon with vegetables',
                snacks: 'Brazil nuts, Apple'
            },
            {
                day: 'Tuesday',
                breakfast: 'Greek yogurt with pumpkin seeds',
                lunch: 'Turkey with brown rice',
                dinner: 'Lean beef with sweet potato',
                snacks: 'Sunflower seeds, Berries'
            },
            {
                day: 'Wednesday',
                breakfast: 'Oatmeal with walnuts',
                lunch: 'Tuna salad with vegetables',
                dinner: 'Chicken breast with roasted vegetables',
                snacks: 'Almonds, Orange'
            },
            {
                day: 'Thursday',
                breakfast: 'Eggs with spinach and avocado',
                lunch: 'Lentil soup with chicken',
                dinner: 'Grilled fish with broccoli',
                snacks: 'Cashews, Pear'
            },
            {
                day: 'Friday',
                breakfast: 'Protein smoothie with chia seeds',
                lunch: 'Chicken with quinoa salad',
                dinner: 'Baked cod with asparagus',
                snacks: 'Walnuts, Banana'
            },
            {
                day: 'Saturday',
                breakfast: 'Cottage cheese with fruits',
                lunch: 'Turkey burger with vegetables',
                dinner: 'Grilled salmon with brown rice',
                snacks: 'Mixed nuts, Apple'
            },
            {
                day: 'Sunday',
                breakfast: 'Vegetable omelet with herbs',
                lunch: 'Chicken soup with vegetables',
                dinner: 'Lean pork with roasted vegetables',
                snacks: 'Brazil nuts, Berries'
            }
        ],
        exercise: 'Moderate exercise 30 minutes daily, Avoid over-exercising',
        water: '8-10 glasses daily',
        tips: [
            'Eat selenium-rich foods',
            'Include iodine sources',
            'Avoid excessive soy products',
            'Limit goitrogenic foods when raw',
            'Take thyroid medication as prescribed'
        ]
    };
}

// Save Diet Plan to Database
function saveDietPlan() {
    const formData = new FormData();
    formData.append('action', 'save-diet');
    formData.append('dietPlan', JSON.stringify(userData.dietPlan));
    
    fetch('app.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            displayDashboard();
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        displayDashboard();
    });
}

// Display Dashboard
function displayDashboard() {
    navigateToSection('dashboard');
    
    // Update user info
    const userName = document.getElementById('userName');
    if (userData.isLoggedIn) {
        userName.textContent = userData.name;
    } else {
        userName.textContent = 'Guest User';
        document.querySelector('.logout-button').textContent = 'Go Home';
    }
    
    // Display health summary
    const healthSummary = document.getElementById('healthSummary');
    const heightM = userData.healthData.height / 100;
    const bmi = (userData.healthData.weight / (heightM * heightM)).toFixed(1);
    
    healthSummary.innerHTML = `
        <span>Age: ${userData.healthData.age}</span>
        <span>Weight: ${userData.healthData.weight} kg</span>
        <span>Height: ${userData.healthData.height} cm</span>
        <span>BMI: ${bmi}</span>
        <span>Condition: ${userData.healthData.disease.replace('-', ' ').toUpperCase()}</span>
    `;
    
    // Display diet plan
    const dietPlan = document.getElementById('dietPlan');
    let dietHTML = '';
    userData.dietPlan.days.forEach(day => {
        dietHTML += `
            <div class="diet-day">
                <h4>${day.day}</h4>
                <p><strong>Breakfast:</strong> ${day.breakfast}</p>
                <p><strong>Lunch:</strong> ${day.lunch}</p>
                <p><strong>Dinner:</strong> ${day.dinner}</p>
                <p><strong>Snacks:</strong> ${day.snacks}</p>
            </div>
        `;
    });
    dietPlan.innerHTML = dietHTML;
    
    // Display exercise plan
    const exercisePlan = document.getElementById('exercisePlan');
    exercisePlan.innerHTML = `<p>${userData.dietPlan.exercise}</p>`;
    
    // Display water intake
    const waterPlan = document.getElementById('waterPlan');
    waterPlan.innerHTML = `
        <p><strong>Recommended Daily Intake:</strong></p>
        <p>${userData.dietPlan.water}</p>
        <p>Drink water throughout the day, especially before meals and during exercise.</p>
    `;
    
    // Display health tips
    const healthTips = document.getElementById('healthTips');
    let tipsHTML = '<ul>';
    userData.dietPlan.tips.forEach(tip => {
        tipsHTML += `<li>${tip}</li>`;
    });
    tipsHTML += '</ul>';
    healthTips.innerHTML = tipsHTML;
}

// Load User Dashboard
function loadUserDashboard() {
    showLoading();
    
    const formData = new FormData();
    formData.append('action', 'get-dashboard');
    
    fetch('app.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        if (data.success) {
            userData.healthData = data.healthData;
            userData.dietPlan = JSON.parse(data.dietPlan);
            displayDashboard();
        } else {
            navigateToSection('health-info');
        }
    })
    .catch(error => {
        hideLoading();
        console.error('Error:', error);
        navigateToSection('health-info');
    });
}

// Check Session
function checkSession() {
    const formData = new FormData();
    formData.append('action', 'check-session');
    
    fetch('app.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) {
            userData.isLoggedIn = true;
            userData.name = data.user.name;
            userData.email = data.user.email;
        }
    })
    .catch(error => {
        console.error('Error checking session:', error);
    });
}

// Logout
function logout() {
    if (!userData.isLoggedIn) {
        navigateToSection('home');
        return;
    }
    
    const formData = new FormData();
    formData.append('action', 'logout');
    
    fetch('app.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        userData = {
            isLoggedIn: false,
            name: '',
            email: '',
            healthData: null,
            dietPlan: null
        };
        navigateToSection('home');
    })
    .catch(error => {
        console.error('Error:', error);
        navigateToSection('home');
    });
}

// Loading Overlay
function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Scroll Animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.feature-card, .stat, .auth-card');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        
        if (isVisible && !el.classList.contains('animate-on-scroll')) {
            el.classList.add('animate-on-scroll');
        }
    });
}