/**
 * Handle data from "courses" table
 */
const sql = require('./db-connection.js');

// Courses contains functions used to get courses related data from DB
const Courses = function (course) {};

const courseInfoFormatter = (sqlCourseRawData) => {
  return {
    _id: sqlCourseRawData['CRN'],
    courseName: sqlCourseRawData['course_name'],
    courseId: sqlCourseRawData['course_id'],
    crn: sqlCourseRawData['CRN'],
    credits: sqlCourseRawData['credits'],
    professor: sqlCourseRawData['professor'],
    courseDescription: sqlCourseRawData['course_description'],
    prerequisites: sqlCourseRawData['prerequisites'],
    classroom: sqlCourseRawData['classroom'],
    building: sqlCourseRawData['building'],
    campus: sqlCourseRawData['campus'],
    department: sqlCourseRawData['department'],
    college: sqlCourseRawData['college'],
    term: sqlCourseRawData['term'],
    registeredStudents: [],
    waitlistedStudents: [],
    capacity: sqlCourseRawData['course_capacity'],
    waitlistCapacity: sqlCourseRawData['waitlist_capacity'],
    postedBy: sqlCourseRawData['posted_by'],
    createdAt: sqlCourseRawData['created_by'],
  };
};

// Get all courses
Courses.getAll = (resCallback) => {
  // resCallback is a function pointer passed from routes
  let sqlQuery = 'SELECT * FROM courses;';
  sql.query(sqlQuery, (err, sqlResData) => {
    // Returning sqlResData, which is the achieved array of data rows, to the corresponding route
    resCallback(err, sqlResData.map(courseInfoFormatter));
  });
};

// Post course
Courses.postCourse = (newCourse, resCallback) => {
  const {
    crn,
    courseId,
    courseName,
    term,
    credits,
    professor,
    prerequisites,
    capacity,
    waitlistCapacity,
    courseDescription,
    department,
    college,
    classroom,
    building,
    campus,
    postedBy,
    createdAt,
  } = newCourse;
  // resCallback is a function pointer passed from routes
  let sqlQuery = `INSERT INTO Courses (CRN, course_id, course_name, credits, professor, course_description, prerequisites, classroom, 
    building, campus, department, college, term, course_capacity, waitlist_capacity, posted_by, created_by) 
    VALUES (${crn}, '${courseId}', '${courseName}', ${credits}, '${professor}', '${courseDescription}', '${prerequisites}', '${classroom}',
    '${building}', '${campus}', '${department}', '${college}', '${term}', ${capacity}, ${waitlistCapacity}, ${postedBy}, '${createdAt}');`;
  sql.query(sqlQuery, (err) => {
    // Returning sqlResData, which is the achieved array of data rows, to the corresponding route
    resCallback(err, null);
  });
};

// Admin deletes course
Courses.deleteCourse = (crn, resCallback) => {
  // resCallback is a function pointer passed from routes
  let sqlQuery = `DELETE FROM Courses WHERE crn = '${crn}';`;
  sql.query(sqlQuery, (err) => {
    resCallback(err, null);
  });
};

module.exports = Courses;
