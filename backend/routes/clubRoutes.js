const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const db = require('../db');

const salt = 10;
const clubTokenSecretKey = "club-jwt-secret-key";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename file to prevent name conflicts
    }
});

// Initialize multer upload middleware
const upload = multer({
    storage: storage
    , limits: {
        fieldNameSize: 1000 * 1024 * 1024,
        fieldSize: 1000 * 1024 * 1024
    }
});

// Club Register Route
router.post('/register', upload.single('profile_photo'), (req, res) => {
    const { name, email, password, address, description } = req.body;
    const profile_photo = req.body.profile_photo;

    // Check if email already exists
    const emailCheckQuery = "SELECT * FROM clubs WHERE email = ?";
    db.query(emailCheckQuery, [email], (emailErr, emailResult) => {
        if (emailErr) {
            return res.status(500).json({ error: "Error checking email existence" });
        }
        if (emailResult.length > 0) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Check if name already exists
        const nameCheckQuery = "SELECT * FROM clubs WHERE name = ?";
        db.query(nameCheckQuery, [name], (nameErr, nameResult) => {
            if (nameErr) {
                return res.status(500).json({ error: "Error checking name existence" });
            }
            if (nameResult.length > 0) {
                return res.status(400).json({ error: "Club name already in use, You may want to consider appending your city name to make it unique." });
            }

            bcrypt.hash(password.toString(), salt, (hashErr, hash) => {
                if (hashErr) {
                    return res.status(500).json({ error: "Error hashing password" });
                }

                const sql = "INSERT INTO clubs (`name`, `email`, `password`, `address`, `description`, `profile_photo`) VALUES (?, ?, ?, ?, ?, ?)";
                const values = [name, email, hash, address, description, profile_photo];
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

// Club Login Route
router.post('/login', (req, res) => {
    const sql = 'SELECT * FROM clubs WHERE email=?';
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
                    const club_id = data[0].club_id
                    const club_token = jwt.sign({ name }, clubTokenSecretKey, { expiresIn: '1d' });
                    res.cookie('club_token', club_token);
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

const verifyClub = (req, res, next) => {
    const club_token = req.cookies.club_token;
    if (!club_token) {
        return res.json({ error: "You are not authenticated" });
    } else {
        jwt.verify(club_token, clubTokenSecretKey, (err, decoded) => {
            if (err) {
                return res.json({ error: "Error in club token" });
            } else {
                req.name = decoded.name;

                // Retrieve club data including profile_photo
                const sql = 'SELECT name, profile_photo ,club_id FROM clubs WHERE name=?';
                db.query(sql, [req.name], (err, data) => {
                    if (err) {
                        return res.status(500).json({ error: "Error retrieving club data" });
                    }
                    req.clubData = data[0]; // Assuming there's only one club with this name
                    next();
                });
            }
        });
    }
};

// Protected Route for Club
router.get('/', verifyClub, (req, res) => {
    if (req.clubData.profile_photo) {
        return res.json({ status: "Success", club_id: req.clubData.club_id, name: req.clubData.name, profile_photo: (req.clubData.profile_photo).toString() });
    }
    return res.json({ status: "Success", club_id: req.clubData.club_id, name: req.clubData.name, profile_photo: (req.clubData.profile_photo) });
});

// Club Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('club_token');
    return res.json({ status: "Success" });
});

router.post('/addGround', upload.array('photos', 4), (req, res) => {
    const { club_id, type, description, start_time, end_time, price } = req.body;
    const photos = req.body.photos; // Get paths of uploaded photos

    const sql = "INSERT INTO grounds (`club_id`, `type`, `description`,`start_time`, `end_time`, `price`, `photo1`,`photo2`,`photo3`,`photo4`) VALUES (?, ?, ?, ?, ?, ?,?,?,?,?)";
    let values;

    if (photos && photos.length > 0) {
        values = [club_id, type, description, start_time, end_time, price, photos[0], photos[1], photos[2], photos[3]];
    } else {
        values = [club_id, type, description, start_time, end_time, price, null, null, null, null]; // Provide null values for photos
    }

    db.query(sql, values, (insertErr, result) => {
        if (insertErr) {
            return res.status(500).json({ error: "Error inserting data into database" });
        }
        return res.json({ status: "Success" });
    });
});

router.post('/addActivity', upload.array('photos', 4), (req, res) => {
    const { club_id, activity_name, category, description, age_group, start_date, end_date, start_time, end_time, instructor_info, capacity, price, contact_information } = req.body;
    const photos = req.body.photos; // Get paths of uploaded photos

    // Validate if start_date is later than end_date
    if (new Date(start_date) > new Date(end_date)) {
        return res.status(400).json({ error: "Start date cannot be later than end date" });
    }

    const sql = "INSERT INTO activities (`club_id`, `activity_name`, `category`,`description`, `age_group`, `start_date`, `end_date`,`start_time`,`end_time`,`instructor_info`,`capacity`,`price`,`photo1`,`photo2`,`photo3`,`photo4`,`contact_information`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    let values;

    if (photos && photos.length > 0) {
        values = [club_id, activity_name, category, description, age_group, start_date, end_date, start_time, end_time, instructor_info, capacity, price, photos[0], photos[1], photos[2], photos[3], contact_information];
    } else {
        values = [club_id, activity_name, category, description, age_group, start_date, end_date, start_time, end_time, instructor_info, capacity, price, null, null, null, null, contact_information];
    }

    db.query(sql, values, (insertErr, result) => {
        if (insertErr) {
            console.log(insertErr)
            return res.status(500).json({ error: "Error inserting data into database" });
        }
        return res.json({ status: "Success" });
    });
});


router.get('/grounds/:clubId', (req, res) => {
    const clubId = req.params.clubId;
    const sql = `SELECT 
        g.ground_id, 
        g.type, 
        g.description,
        TIME_FORMAT(g.start_time, '%H:%i') AS start_time, 
        TIME_FORMAT(g.end_time, '%H:%i') AS end_time, 
        g.price, 
        c.name AS club_name,
        g.photo1,
        g.photo2,
        g.photo3,
        g.photo4
    FROM grounds AS g
    INNER JOIN clubs AS c ON g.club_id = c.club_id
    WHERE g.club_id = ?`;

    db.query(sql, [clubId], (err, results) => {
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

router.get('/activities/:clubId', (req, res) => {
    const clubId = req.params.clubId;
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
        a.photo1,
        a.photo2,
        a.photo3,
        a.photo4,
        a.contact_information
    FROM activities AS a
    WHERE a.club_id = ?`;

    db.query(sql, [clubId], (err, results) => {
        if (err) {
            console.error("Error fetching activities data:", err);
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




module.exports = router;
