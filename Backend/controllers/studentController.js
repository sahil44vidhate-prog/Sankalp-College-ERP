const db = require("../models/db");

// Add Student
exports.addStudent = (req, res) => {

    const {
        urn,
        full_name,
        email,
        phone,
        gender,
        dob,
        department,
        course,
        semester,
        address
    } = req.body;

    const sql = `
    INSERT INTO students
    (urn, full_name, email, phone, gender, dob, department, course, semester, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            urn,
            full_name,
            email,
            phone,
            gender,
            dob,
            department,
            course,
            semester,
            address
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Student added successfully."
            });

        }
    );
};


// Get Students
exports.getStudents = (req, res) => {

    db.query(
        "SELECT * FROM students ORDER BY id DESC",
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json(result);

        }
    );

};


// Update Student
exports.updateStudent = (req, res) => {

    res.json({
        message: "Update Student API Coming Soon"
    });

};


// Delete Student
exports.deleteStudent = (req, res) => {

    res.json({
        message: "Delete Student API Coming Soon"
    });

};