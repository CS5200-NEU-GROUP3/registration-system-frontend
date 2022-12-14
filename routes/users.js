var express = require('express');
var router = express.Router();
const userQueries = require('../models/users-handler');

/* GET users listing. */
router.get('/getallusers', function (req, res, next) {
  userQueries.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving users.',
      });
    else res.send(data);
  });
});

/* Find the info of a specific user by username specified in req.body */
router.post('/login', function (req, res, next) {
  const userName = req.body['username'];
  const reqPassword = req.body['password'];
  if (userName) {
    userQueries.findUser(userName, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || 'Some error occurred while login.',
        });
      else {
        // Determine whether the password is correct
        if (data?.password === reqPassword) res.json(data);
        else {
          res.status(500).send({
            message: 'Login Failed!',
          });
        }
      }
    });
  } else {
    res.status(500).send({
      message: 'No username found in request body!',
    });
  }
});

// Register and create a new user
router.post('/register', function (req, res, next) {
  const userName = req.body['username'];
  const reqPassword = req.body['password'];
  const roleType = req.body['role'];
  // check whether must-have info is given in request body
  if (userName && reqPassword && roleType) {
    // check whether the user exists
    userQueries.findUser(userName, (err, data) => {
      if (data)
        res.status(500).send({
          message: 'User existent!',
        });
      else {
        // if username and password are given and no user conflicts, create user
        userQueries.createUser(userName, reqPassword, roleType, (err) => {
          if (err)
            res.status(500).send({
              message:
                err.message ||
                'Some error occurred while registering new user.',
            });
          else res.send('New User Register Succeeded!');
        });
      }
    });
  } else {
    res.status(500).send({
      message: 'Info missing in request body!',
    });
  }
});

// Student registers courses
router.post('/registercourse', function (req, res, next) {
  const studentId = req.body.user._id;
  const crn = req.body.course._id;
  const dateTime = req.body.dateTime;
  userQueries.registerCourse(studentId, crn, dateTime, (err) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred while registering course.',
      });
    else res.send('registered course successfully!');
  });
});

// Student get registered courses
router.post('/getregisteredcourses', function (req, res, next) {
  const studentId = req.body.userId;
  userQueries.getRegisteredCourses(studentId, (err, data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred while getting registered course.',
      });
    else res.json(data);
  });
});

// Student get waitlisted courses
router.post('/getwaitlistedcourses', function (req, res, next) {
  const studentId = req.body.userId;
  userQueries.getWaitlistedCourses(studentId, (err, data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred while getting waitlisted course.',
      });
    else res.json(data);
  });
});

router.post('/getusercomments', function (req, res, next) {
  const studentId = req.body.userId;
  userQueries.getUserComments(studentId, (err, data) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred while getting user comments.',
      });
    else res.json(data);
  });
});

// Student waitlist courses
router.post('/waitlistcourse', function (req, res, next) {
  const studentId = req.body.user._id;
  const crn = req.body.course._id;
  const dateTime = req.body.dateTime;
  userQueries.waitlistCourse(studentId, crn, dateTime, (err) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred while joining course waitlist.',
      });
    else res.send('waitlisted course successfully!');
  });
});

// Student drop courses
router.post('/dropcourse', function (req, res, next) {
  const studentId = req.body.studentId;
  const crn = req.body.crn;
  userQueries.dropCourse(studentId, crn, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while dropping course.',
      });
    else res.send('dropped course successfully!');
  });
});

// Student drop waitlist
router.post('/dropwaitlist', function (req, res, next) {
  const studentId = req.body.studentId;
  const crn = req.body.crn;
  userQueries.dropWaitlist(studentId, crn, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while dropping waitlist.',
      });
    else res.send('drop waitlist successfully!');
  });
});

// User posts comment
router.post('/postcomment', function (req, res, next) {
  const studentId = req.body.user._id;
  const crn = req.body.course.crn;
  const content = req.body.content;
  const dateTime = req.body.dateTime;
  userQueries.commentCourse(studentId, crn, content, dateTime, (err) => {
    if (err)
      res.status(500).send({
        message: 'Some error occurred while posting comment.',
      });
    else res.send('comment posted successfully!');
  });
});

// Admin deletes course
router.post('/deletecourse', function (req, res, next) {
  userQueries.deleteCourse((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred deleting course.',
      });
    else res.send('delete course successfully!');
  });
});

//Update profile
router.post('/updateprofile', function (req, res, next) {
  const newProfile = req.body;
  const userId = req.body._id;
  userQueries.updateProfile(newProfile, userId, (err) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while updating profile.',
      });
    else res.send('Update Profile Succeeded!');
  });
});

//Delete Comment
router.post('/deletecomment', function (req, res, next) {
  const commentId = req.body.id;
  userQueries.deleteComment(commentId, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || 'Some error occurred while deleting course.',
      });
    else res.send(data);
  });
});

module.exports = router;
