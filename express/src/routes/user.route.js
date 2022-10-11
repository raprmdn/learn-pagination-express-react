const express = require('express');
const UserController = require('../controllers/user.controller');

const router = express.Router();

router.get('/', UserController.index);

module.exports = router;

