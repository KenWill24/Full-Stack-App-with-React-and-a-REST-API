//load modules
'use strict';
const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticateUser = require('../middleware/authenticateUser');

/**
 * GET /api/users
 * Return the currently authenticated user
 */
router.get('/users', authenticateUser, async (req, res, next) => {
  try {
    const user = req.currentUser;

    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users
 * Create a new user
 */
router.post("/users", async (req, res, next) => {
  try {
    await User.create(req.body);
    res.status(201).end();
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // ✅ Extract all validation messages
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });
    } else {
      next(error); // Pass other errors to global handler
    }
  }
});


module.exports = router;