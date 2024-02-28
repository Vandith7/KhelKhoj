const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../db')


const salt = 10;
const userTokenSecretKey = "user-jwt-secret-key";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent name conflicts
    }
});

// Initialize multer upload middleware
const upload = multer({ storage: storage });

// User Register Route
router.post('/register', upload.single('profile_photo'), (req, res) => {
    const { name, email, gender, city, password } = req.body;
    const profile_photo = req.body.profile_photo;

    // Check if email already exists
    const emailCheckQuery = "SELECT * FROM users WHERE email = ?";
    db.query(emailCheckQuery, [email], (emailErr, emailResult) => {
        if (emailErr) {
            return res.status(500).json({ error: "Error checking email existence" });
        }
        if (emailResult.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Check if name already exists
        const nameCheckQuery = "SELECT * FROM users WHERE name = ?";
        db.query(nameCheckQuery, [name], (nameErr, nameResult) => {
            if (nameErr) {
                return res.status(500).json({ error: "Error checking name existence" });
            }
            if (nameResult.length > 0) {
                return res.status(400).json({ error: "User name already in use" });
            }

            bcrypt.hash(password.toString(), salt, (hashErr, hash) => {
                if (hashErr) {
                    return res.status(500).json({ error: "Error hashing password" });
                }

                const sql = "INSERT INTO users (`name`, `email`, `gender`, `city`, `password`, `profile_photo`) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [name, email, gender, city, hash, profile_photo];
                db.query(sql, values, (insertErr, result) => {
                    if (insertErr) {
                        return res.status(500).json({ error: "Error inserting data into database" });
                    }
                    return res.json({ status: "Success" });
                });
            });
        });
    });
});

// User Login Route
router.post('/login', (req, res) => {
    const sql = 'SELECT * FROM users WHERE email=?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Login error in server" });
        } if (data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) {
                    return res.status(500).json({ error: "Password hash error" });
                } if (response) {
                    const name = data[0].name;
                    const profile_photo = data[0].profile_photo
                    const user_token = jwt.sign({ name }, userTokenSecretKey, { expiresIn: '1d' });
                    res.cookie('user_token', user_token);
                    return res.json({ status: "Success" });
                } else {
                    return res.status(500).json({ error: "Password not matched" });
                }
            })
        } else {
            return res.status(500).json({ error: "No email exists" });
        }
    })
});


const verifyUser = (req, res, next) => {
    const user_token = req.cookies.user_token;

    if (!user_token) {
        return res.json({ error: "You are not authenticated" });
    } else {
        jwt.verify(user_token, userTokenSecretKey, (err, decoded) => {
            if (err) {
                return res.json({ error: "Error in user token" });
            } else {
                req.name = decoded.name;

                // Retrieve user data including profile_photo
                const sql = 'SELECT name, profile_photo FROM users WHERE name=?';
                db.query(sql, [req.name], (err, data) => {
                    if (err) {
                        return res.status(500).json({ error: "Error retrieving user data" });
                    }
                    req.userData = data[0]; // Assuming there's only one user with this name
                    next();
                });
            }
        });
    }
};

// Protected Route for User
router.get('/', verifyUser, (req, res) => {
    if (req.userData.profile_photo) {
        return res.json({ status: "Success", name: req.userData.name, profile_photo: (req.userData.profile_photo).toString() });
    }
    return res.json({ status: "Success", name: req.userData.name, profile_photo: (req.userData.profile_photo) });
});

// User Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('user_token');
    return res.json({ status: "Success" });
});

router.get('/grounds', (req, res) => {
    const sql = `SELECT 
        g.ground_id, 
        g.type, 
        g.description,
        TIME_FORMAT(g.start_time, '%H:%i') AS start_time, 
        TIME_FORMAT(g.end_time, '%H:%i') AS end_time, 
        g.price, 
        c.name AS club_name,
        c.address,
        g.photo1,
        g.photo2,
        g.photo3,
        g.photo4
    FROM grounds AS g
    INNER JOIN clubs AS c ON g.club_id = c.club_id`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching ground data:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        const groundsWithPhotos = results.map(ground => ({
            ...ground,
            photo1: ground.photo1 ? ground.photo1.toString() : null,
            photo2: ground.photo2 ? ground.photo2.toString() : null,
            photo3: ground.photo3 ? ground.photo3.toString() : null,
            photo4: ground.photo4 ? ground.photo4.toString() : null
        }));

        res.json({ status: "Success", grounds: groundsWithPhotos });
    });
});


router.get('/activities', (req, res) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    const sql = `SELECT 
        a.activity_id, 
        a.activity_name, 
        a.category,
        a.description,
        a.age_group,
        DATE_FORMAT(a.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(a.end_date, '%Y-%m-%d') AS end_date,
        TIME_FORMAT(a.start_time, '%H:%i') AS start_time, 
        TIME_FORMAT(a.end_time, '%H:%i') AS end_time, 
        a.instructor_info,
        a.capacity,
        a.price, 
        c.name AS club_name,
        c.address,
        a.photo1,
        a.photo2,
        a.photo3,
        a.photo4,
        a.contact_information
    FROM activities AS a
    INNER JOIN clubs AS c ON a.club_id = c.club_id
    WHERE a.end_date > '${currentDate}'`; // Filter activities with end date later than today

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching activity data:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        const activitiesWithPhotos = results.map(activity => ({
            ...activity,
            photo1: activity.photo1 ? activity.photo1.toString() : null,
            photo2: activity.photo2 ? activity.photo2.toString() : null,
            photo3: activity.photo3 ? activity.photo3.toString() : null,
            photo4: activity.photo4 ? activity.photo4.toString() : null
        }));

        res.json({ status: "Success", activities: activitiesWithPhotos });
    });
});

router.get('/grounds/:groundId', (req, res) => {
    const groundId = req.params.groundId;

    const sql = `SELECT 
    g.ground_id, 
    g.type, 
    g.description,
    TIME_FORMAT(g.start_time, '%H:%i') AS start_time, 
    TIME_FORMAT(g.end_time, '%H:%i') AS end_time, 
    g.price, 
    c.name AS club_name,
    c.address,
    g.photo1,
    g.photo2,
    g.photo3,
    g.photo4
FROM grounds AS g
INNER JOIN clubs AS c ON g.club_id = c.club_id
    WHERE g.ground_id = ?`;

    db.query(sql, [groundId], (err, results) => {
        if (err) {
            console.error("Error fetching ground data:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: "Error", error: "Ground not found" });
        }

        const ground = results[0];

        // Convert photo paths to strings
        const groundWithPhotos = {
            ...ground,
            photo1: ground.photo1 ? ground.photo1.toString() : null,
            photo2: ground.photo2 ? ground.photo2.toString() : null,
            photo3: ground.photo3 ? ground.photo3.toString() : null,
            photo4: ground.photo4 ? ground.photo4.toString() : null
        };

        res.json({ status: "Success", ground: groundWithPhotos });
    });
});


module.exports = router;
