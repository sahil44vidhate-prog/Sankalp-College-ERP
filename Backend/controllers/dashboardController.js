const db = require("../models/db");

exports.getStats = (req, res) => {
    const stats = {
        students: 0,
        faculty: 0,
        departments: 0,
        courses: 0
    };

    db.query("SELECT COUNT(*) AS total FROM students", (err, studentResult) => {
        if (err) return res.status(500).json(err);

        stats.students = studentResult[0].total;

        db.query("SELECT COUNT(*) AS total FROM faculty", (err, facultyResult) => {
            if (err) return res.status(500).json(err);

            stats.faculty = facultyResult[0].total;

            db.query("SELECT COUNT(*) AS total FROM departments", (err, deptResult) => {
                if (err) return res.status(500).json(err);

                stats.departments = deptResult[0].total;

                db.query("SELECT COUNT(*) AS total FROM courses", (err, courseResult) => {
                    if (err) return res.status(500).json(err);

                    stats.courses = courseResult[0].total;

                    res.json(stats);
                });
            });
        });
    });
};