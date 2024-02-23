const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../db')


const salt = 10;

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
                    const token = jwt.sign({ name }, "jwt-secret-key", { expiresIn: '1d' });
                    res.cookie('token', token);
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
    const token = req.cookies.token;
    if (!token) {
        return res.json({ error: "You are not authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ error: "Error in token" });
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
    res.clearCookie('token');
    return res.json({ status: "Success" });
});



module.exports = router;
