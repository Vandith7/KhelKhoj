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

router.post('/checkCredentials', (req, res) => {
    const { userId, password } = req.body;

    // Query to retrieve user data based on userId
    const getUserQuery = 'SELECT * FROM users WHERE user_id = ?';

    // Execute the query
    db.query(getUserQuery, [userId], (err, results) => {
        if (err) {
            console.error("Error checking credentials:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        // Check if user with the provided userId exists
        if (results.length === 0) {
            return res.status(404).json({ status: "Error", error: "User not found" });
        }

        // User found, compare passwords
        const user = results[0];
        bcrypt.compare(password.toString(), user.password, (compareErr, compareResult) => {
            if (compareErr) {
                console.error("Error comparing passwords:", compareErr);
                return res.status(500).json({ status: "Error", error: "Internal Server Error" });
            }

            // Passwords match
            if (compareResult) {
                return res.json({ status: "Success", message: "Valid credentials" });
            } else {
                return res.status(401).json({ status: "Error", error: "Password not matched" });
            }
        });
    });
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
                const sql = 'SELECT name,user_id, profile_photo FROM users WHERE name=?';
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
        return res.json({ status: "Success", user_id: req.userData.user_id, name: req.userData.name, profile_photo: (req.userData.profile_photo).toString() });
    }
    return res.json({ status: "Success", user_id: req.userData.user_id, name: req.userData.name, profile_photo: (req.userData.profile_photo) });
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
    INNER JOIN clubs AS c ON g.club_id = c.club_id
    WHERE g.visibility = 1`; // Add condition to filter visible grounds only

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
    c.description AS club_description,
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

router.get('/activities/:activityId', (req, res) => {
    const activityId = req.params.activityId;

    const sql = `SELECT 
        a.activity_id,
        a.activity_name,
        a.category,
        a.description AS activity_description,
        a.age_group,
        DATE_FORMAT(a.start_date, '%Y-%m-%d') AS start_date,
        DATE_FORMAT(a.end_date, '%Y-%m-%d') AS end_date,
        TIME_FORMAT(a.start_time, '%H:%i') AS start_time,
        TIME_FORMAT(a.end_time, '%H:%i') AS end_time,
        a.instructor_info,
        a.capacity,
        a.price,
        a.contact_information,
        a.photo1,
        a.photo2,
        a.photo3,
        a.photo4,
        c.name AS club_name,
        c.description AS club_description
    FROM activities AS a
    INNER JOIN clubs AS c ON a.club_id = c.club_id
    WHERE a.activity_id = ?`;

    db.query(sql, [activityId], (err, results) => {
        if (err) {
            console.error("Error fetching activity data:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: "Error", error: "Activity not found" });
        }

        const activity = results[0];

        // Convert photo paths to strings if they exist
        const activityWithPhotos = {
            ...activity,
            photo1: activity.photo1 ? activity.photo1.toString() : null,
            photo2: activity.photo2 ? activity.photo2.toString() : null,
            photo3: activity.photo3 ? activity.photo3.toString() : null,
            photo4: activity.photo4 ? activity.photo4.toString() : null
        };

        res.json({ status: "Success", activity: activityWithPhotos });
    });
});



// User Ground Booking Route
router.post('/grounds/:groundId/book', (req, res) => {
    const { groundId } = req.params;
    const { userId, date, startTime, endTime } = req.body;

    // Get current time
    const currentTime = new Date().toISOString().split('T')[1].split('.')[0];

    // Check if the booking start time is in the future
    if (date === new Date().toISOString().split('T')[0] && startTime < currentTime) {
        return res.status(400).json({ status: "Error", error: "Cannot book past time slots for today" });
    }

    // Begin a database transaction
    db.beginTransaction(function (err) {
        if (err) {
            console.error("Error beginning transaction:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        // Check if the slot spans across two different dates
        let adjustedEndTime = endTime;
        if (startTime > endTime) {
            adjustedEndTime = '23:59:59'; // End time for the current date
        }

        // Check if the requested time slot is available
        const availabilityQuery = `SELECT * FROM bookings 
                                   WHERE ground_id = ? 
                                   AND date = ? 
                                   AND ((booking_start_time < ? AND booking_end_time > ?) 
                                        OR (booking_start_time < ? AND booking_end_time > ?) 
                                        OR (booking_start_time >= ? AND booking_end_time <= ?)) FOR UPDATE`;

        db.query(availabilityQuery, [groundId, date, startTime, adjustedEndTime, startTime, adjustedEndTime, startTime, adjustedEndTime], (availabilityErr, availabilityResult) => {
            if (availabilityErr) {
                console.error("Error checking availability:", availabilityErr);
                return db.rollback(function () {
                    res.status(500).json({ status: "Error", error: "Internal Server Error" });
                });
            }

            // If there are overlapping bookings, rollback transaction and return "Slot not available"
            if (availabilityResult.length > 0) {
                db.rollback(function () {
                    res.status(500).json({ error: "No slots available for specified time" });
                });
            }

            // If the slot is available, insert a new booking record
            const insertQuery = `INSERT INTO bookings (ground_id, user_id, date, booking_start_time, booking_end_time) 
                                 VALUES (?, ?, ?, ?, ?)`;

            db.query(insertQuery, [groundId, userId, date, startTime, endTime], (insertErr, insertResult) => {
                if (insertErr) {
                    console.error("Error booking ground slot:", insertErr);
                    return db.rollback(function () {
                        // res.status(500).json({ status: "Error", error: "Internal Server Error" });
                        res.status(500).json({ error: "No slots available for specified time" });
                    });
                }
                // Commit transaction if everything is successful
                db.commit(function (commitErr) {
                    if (commitErr) {
                        console.error("Error committing transaction:", commitErr);
                        return db.rollback(function () {
                            res.status(500).json({ status: "Error", error: "Internal Server Error" });
                        });
                    }
                    return res.json({ status: "Success", message: "Ground slot booked successfully" });
                });
            });
        });
    });
});



router.get('/grounds/:groundId/bookings', (req, res) => {
    const groundId = req.params.groundId;
    const date = req.query.date;

    const sql = `SELECT * FROM bookings WHERE ground_id = ? AND date = ?`;

    db.query(sql, [groundId, date], (err, results) => {
        if (err) {
            console.error("Error fetching bookings:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        res.json({ status: "Success", bookings: results });
    });
});

router.get('/getBookings', verifyUser, (req, res) => {
    const user_id = req.userData.user_id;
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    const sql = `SELECT b.booking_id, DATE_FORMAT(b.date, '%Y-%m-%d') AS date, b.booking_start_time, b.booking_end_time, g.club_id, g.ground_id, g.type AS ground_type, c.name AS club_name
                 FROM bookings AS b
                 INNER JOIN grounds AS g ON b.ground_id = g.ground_id
                 INNER JOIN clubs AS c ON g.club_id = c.club_id
                 WHERE b.user_id = ? AND b.date >= ?`;

    db.query(sql, [user_id, currentDate], (err, results) => {
        if (err) {
            console.error("Error fetching bookings:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        res.json({ status: "Success", bookings: results });
    });
});
// User Cancel Booking Route
router.get('/bookings/:bookingId', verifyUser, (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.userData.user_id;

    // Query to fetch details of the booking along with ground and club details
    const sql = `SELECT b.*, 
                        g.ground_id, 
                        g.type AS ground_type, 
                        g.description AS ground_description,
                        g.start_time AS ground_start_time,
                        g.end_time AS ground_end_time,
                        g.price AS ground_price,
                        c.club_id,
                        c.name AS club_name,
                        c.address AS club_address
                 FROM bookings AS b
                 INNER JOIN grounds AS g ON b.ground_id = g.ground_id
                 INNER JOIN clubs AS c ON g.club_id = c.club_id
                 WHERE b.booking_id = ? AND b.user_id = ?`;

    // Execute the query
    db.query(sql, [bookingId, userId], (err, results) => {
        if (err) {
            console.error("Error fetching booking details:", err);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ status: "Error", error: "Booking not found" });
        }

        const booking = results[0];

        // Calculate duration
        const startTime = new Date(`1970-01-01T${booking.booking_start_time}`);
        const endTime = new Date(`1970-01-01T${booking.booking_end_time}`);
        const durationMilliseconds = endTime - startTime;
        const durationHours = Math.floor(durationMilliseconds / (1000 * 60 * 60));
        const durationMinutes = Math.floor((durationMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        const duration = `${durationHours} hours ${durationMinutes} minutes`;

        // Add duration to the booking object
        booking.duration = duration;

        return res.json({ status: "Success", booking });
    });
});
// User Cancel Booking Route
router.post('/bookings/:bookingId/cancel', verifyUser, (req, res) => {
    const bookingId = req.params.bookingId;
    const userId = req.userData.user_id;

    // Check if the booking belongs to the user
    const checkOwnershipQuery = 'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?';
    db.query(checkOwnershipQuery, [bookingId, userId], (checkErr, checkResults) => {
        if (checkErr) {
            console.error("Error checking ownership:", checkErr);
            return res.status(500).json({ status: "Error", error: "Internal Server Error" });
        }

        if (checkResults.length === 0) {
            return res.status(403).json({ status: "Error", error: "You are not authorized to cancel this booking" });
        }

        // If the booking belongs to the user, proceed with cancellation
        const cancelQuery = 'DELETE FROM bookings WHERE booking_id = ?';
        db.query(cancelQuery, [bookingId], (cancelErr, cancelResults) => {
            if (cancelErr) {
                console.error("Error canceling booking:", cancelErr);
                return res.status(500).json({ status: "Error", error: "Internal Server Error" });
            }

            return res.json({ status: "Success", message: "Booking canceled successfully" });
        });
    });
});


router.post('/updateProfile', verifyUser, upload.single('profile_photo'), (req, res) => {
    const userId = req.userData.user_id;
    const { name, email } = req.body;
    const profile_photo = req.body.profile_photo || null;

    // Check if the provided email is already in use by another user
    if (email) {
        const emailCheckQuery = "SELECT * FROM users WHERE email = ? AND user_id != ?";
        db.query(emailCheckQuery, [email, userId], (emailErr, emailResult) => {
            if (emailErr) {
                return res.status(500).json({ error: "Error checking email existence" });
            }
            if (emailResult.length > 0) {
                return res.status(400).json({ error: "Email already in use" });
            }

            // Update email if available
            const updateEmailQuery = "UPDATE users SET email = ? WHERE user_id = ?";
            db.query(updateEmailQuery, [email, userId], (updateEmailErr, updateEmailResult) => {
                if (updateEmailErr) {
                    return res.status(500).json({ error: "Error updating email" });
                }
                // If name is also provided, update it as well
                if (name) {
                    updateName(name, userId, profile_photo, res);
                } else {
                    return res.json({ status: "Success", message: "Email updated successfully" });
                }
            });
        });
    } else if (name) {
        // If only name is provided, update name
        updateName(name, userId, profile_photo, res);
    } else if (profile_photo) {
        // If only profile photo is provided, update profile photo
        const updateProfilePhotoQuery = "UPDATE users SET profile_photo = ? WHERE user_id = ?";
        db.query(updateProfilePhotoQuery, [profile_photo, userId], (updatePhotoErr, updatePhotoResult) => {
            if (updatePhotoErr) {
                return res.status(500).json({ error: "Error updating profile photo" });
            }
            return res.json({ status: "Success", message: "Profile photo updated successfully" });
        });
    } else {
        return res.status(400).json({ error: "No data provided for update" });
    }
});

// Function to update name
function updateName(name, userId, profile_photo, res) {
    const nameCheckQuery = "SELECT * FROM users WHERE name = ? AND user_id != ?";
    db.query(nameCheckQuery, [name, userId], (nameErr, nameResult) => {
        if (nameErr) {
            return res.status(500).json({ error: "Error checking name existence" });
        }
        if (nameResult.length > 0) {
            return res.status(400).json({ error: "User name already in use" });
        }

        const updateNameQuery = "UPDATE users SET name = ? WHERE user_id = ?";
        db.query(updateNameQuery, [name, userId], (updateNameErr, updateNameResult) => {
            if (updateNameErr) {
                return res.status(500).json({ error: "Error updating name" });
            }
            if (profile_photo) {
                // If profile photo is also provided, update it
                const updateProfilePhotoQuery = "UPDATE users SET profile_photo = ? WHERE user_id = ?";
                db.query(updateProfilePhotoQuery, [profile_photo, userId], (updatePhotoErr, updatePhotoResult) => {
                    if (updatePhotoErr) {
                        return res.status(500).json({ error: "Error updating profile photo" });
                    }
                    return res.json({ status: "Success", message: "Name and profile photo updated successfully" });
                });
            } else {
                return res.json({ status: "Success", message: "Name updated successfully" });
            }
        });
    });
}



module.exports = router;
