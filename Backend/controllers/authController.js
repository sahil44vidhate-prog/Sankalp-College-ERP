const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// REGISTER
exports.register = async (req, res) => {
    try {
       const { full_name, urn, email, password, role } = req.body;
        // Check if urn already exists
        db.query(
    "SELECT * FROM users WHERE urn = ? AND status='active'",
    [urn],
            async (err, result) => {
                if (err) {
                    return res.status(500).json({ message: err.message });
                }

                if (result.length > 0) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                // Hash password
                const hashedPassword = await bcrypt.hash(password, 10);

                db.query(
                    "INSERT INTO users (full_name,urn,email,password,role) VALUES (?,?,?,?,?)",
                    [full_name, urn, email, hashedPassword, role],
                    (err) => {
                        if (err) {
                            return res.status(500).json({
                                message: err.message
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "User Registered Successfully"
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// LOGIN
exports.login = (req, res) => {
    const { urn, password } = req.body;

    db.query(
    "SELECT * FROM users WHERE urn = ?",
    [urn],
    async (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (result.length === 0) {
                return res.status(401).json({
                    message: "Invalid Email or Password"
                });
            }

            const user = result[0];

            const match = await bcrypt.compare(password, user.password);

            if (!match) {
                return res.status(401).json({
                    message: "Invalid Email or Password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role
                }
            });
        }
    );
};