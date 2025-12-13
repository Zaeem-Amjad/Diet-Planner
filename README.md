# Diet-Planner
Absolute fit for every kind of man to be fit by using Diet-Planner 


Smart Health & Diet Planner - XAMPP Setup 

Prerequisites 

XAMPP 7.4+ (Download: https://www.apachefriends.org/) 

Web browser (Chrome/Firefox/Safari/Edge) 

Internet connection (for images) 

 

Installation 

1. Install XAMPP 

Windows: Run installer → Install to C:\xampp → Launch Control Panel 

 Mac: Open DMG → Drag to Applications → Open XAMPP 

 Linux: 

chmod +x xampp-installer.run 
sudo ./xampp-installer.run 
  

2. Copy Project Files 

Place all files in XAMPP's web directory: 

Windows: C:\xampp\htdocs\Diet-Planner\ 

 Mac: /Applications/XAMPP/htdocs/Diet-Planner/ 

 Linux: /opt/lampp/htdocs/Diet-Planner/ 

Files to copy: 

index.html 

style.css 

script.js 

app.php 

database.sql 

 

Database Setup 

Step 1: Start Services 

Open XAMPP Control Panel 

Click Start for Apache 

Click Start for MySQL 

Both should show green "Running" 

Step 2: Create Database 

Go to: http://localhost/phpmyadmin 

Click "SQL" tab 

Copy entire content of database.sql 

Paste and click "Go" 

Alternative: Click "Import" → Choose database.sql → Click "Go" 

Step 3: Verify 

Check left sidebar for health_planner database with 3 tables: 

users 

health_data 

diet_plans 

 

Configuration 

Check Database Settings 

Open app.php - these should match: 

$db_host = 'localhost'; 
$db_user = 'root'; 
$db_pass = '';  // Empty for default XAMPP 
$db_name = 'health_planner'; 
  

Only change if you modified MySQL settings 

 

Run Application 

Ensure Apache & MySQL are running 

Open browser 

Navigate to: http://localhost/Diet-Planner/ 

You should see the home page 

 

Quick Test 

Test Signup 

Click "Get Started" → "Create Account" 

Enter: Name, Email, Password 

Submit → Should redirect to Health Info 

Test Complete Flow 

Fill health details (age, weight, height, gender, condition) 

Click "Generate My Plan" 

Wait for loading 

Dashboard should show your personalized plan 

Test Login 

Logout → Go back to home 

Login with your credentials 

Should load your saved dashboard 

 

Troubleshooting 

Cannot Access localhost/Diet-Planner 

Problem: Site not reachable 

 Fix: 

Check Apache is running (green in XAMPP) 

Try: http://127.0.0.1/Diet-Planner/ 

Port conflict? Change Apache port to 8080 in config 

Database Connection Failed 

Problem: "Database connection failed" error 

 Fix: 

Check MySQL is running (green in XAMPP) 

Verify database exists in phpMyAdmin 

Confirm app.php credentials are correct 

Default: user=root, password=empty 

Images Not Loading 

Problem: Broken images 

 Fix: 

Check internet connection (images from Unsplash CDN) 

Disable ad blockers 

Styles Not Working 

Problem: Plain HTML with no colors 

 Fix: 

Clear browser cache (Ctrl+Shift+Delete) 

Hard reload (Ctrl+F5 on Windows, Cmd+Shift+R on Mac) 

Check style.css is in same folder as index.html 

Forms Not Submitting 

Problem: Buttons don't work 

 Fix: 

Press F12 → Check Console for errors 

Verify script.js exists in folder 

Enable JavaScript in browser 

Port 80 Already in Use 

Problem: Apache won't start 

 Fix: 

Open XAMPP → Config → httpd.conf 

Change Listen 80 to Listen 8080 

Save and restart Apache 

Use: http://localhost:8080/Diet-Planner/ 

 

Common Errors 

Error 

Solution 

"Table doesn't exist" 

Re-run database.sql in phpMyAdmin 

"Access denied for user" 

Check MySQL credentials in app.php 

404 Not Found 

Verify files are in htdocs/Diet-Planner/ 

Session not persisting 

Enable cookies in browser 

 

Mobile Access 

Access from phone/tablet on same network: 

Find computer IP: ipconfig (Windows) or ifconfig (Mac/Linux) 

On mobile: http://YOUR-IP/Diet-Planner/ 

Example: http://192.168.1.100/Diet-Planner/ 

 

Security Warning 

⚠️ This setup is for LOCAL DEVELOPMENT only! 

For production deployment, you need: 

Strong MySQL password 

HTTPS/SSL certificate 

Enhanced security measures 

 

Quick Checklist 

[ ] XAMPP installed 

[ ] Apache running 

[ ] MySQL running 

[ ] Files in htdocs/Diet-Planner/ 

[ ] Database created from database.sql 

[ ] Can access http://localhost/Diet-Planner/ 

[ ] Signup works 

[ ] Dashboard displays 

 

Support 

Issues? Email: contact@dietplanner.com 

Setup Version: 1.0 | Updated: December 2025 

 
